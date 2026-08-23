const MAX_PAGE_TEXT = 12000;

export type VerificationResult = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  score: number | null;
  reasons: string[];
  summary: string | null;
};

function runRules(jobUrl: string, pageText: string): VerificationResult {
  const text = `${jobUrl} ${pageText}`.toLowerCase();
  const reasons: string[] = [];

  if (/pay|payment|fee|buy.*equipment|registration fee/.test(text)) {
    reasons.push("The listing appears to request money or payment from applicants.");
  }
  if (/crypto|bitcoin|gift card|western union/.test(text)) {
    reasons.push("The listing mentions high-risk payment methods.");
  }
  if (/whatsapp only|telegram only|contact only on whatsapp/.test(text)) {
    reasons.push("The listing appears to rely on an informal messaging channel only.");
  }
  if (/@(gmail|yahoo|outlook|hotmail)\./.test(text)) {
    reasons.push("The contact address uses a free email provider rather than a company domain.");
  }
  if (/no experience.*r|r\s?[0-9,]+.*(day|week)|guaranteed income/.test(text)) {
    reasons.push("The listing contains unusually strong income or low-effort claims.");
  }

  if (reasons.length >= 2) return { riskLevel: "HIGH", score: 85, reasons, summary: "Multiple common job-scam indicators were detected." };
  if (reasons.length === 1) return { riskLevel: "MEDIUM", score: 55, reasons, summary: "One potential job-scam indicator was detected." };
  if (pageText.startsWith("Unable to fetch page")) {
    return { riskLevel: "UNKNOWN", score: null, reasons: ["The job page could not be fetched for automated review."], summary: "Automated review could not access the submitted page; manual investigation is required." };
  }
  return { riskLevel: "LOW", score: 15, reasons: ["No common scam indicators were found in the fetched page."], summary: "No common scam indicators were detected, but this is not proof that the job is legitimate." };
}

async function fetchPageText(jobUrl: string) {
  const parsedUrl = new URL(jobUrl);
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    hostname === "169.254.169.254" ||
    /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  ) {
    throw new Error("Private or local job links cannot be checked");
  }

  const response = await fetch(jobUrl, {
    signal: AbortSignal.timeout(4000),
    headers: { "User-Agent": "JobConnect-SA-Verification/1.0" },
  });
  if (!response.ok) throw new Error(`Job page returned ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) throw new Error("Job link is not an HTML page");

  const html = (await response.text()).slice(0, 200000);
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&amp;|&quot;|&#39;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_PAGE_TEXT);
}

async function runGroq(jobUrl: string, pageText: string, ruleResult: VerificationResult) {
  const isPlaceholder = (value: string | undefined) =>
    !value || value.includes("your_") || value.includes("replace_");
  const xaiKey = isPlaceholder(process.env.XAI_API_KEY) ? null : process.env.XAI_API_KEY;
  const groqKey = isPlaceholder(process.env.GROQ_API_KEY) ? null : process.env.GROQ_API_KEY;
  const apiKey = xaiKey ?? groqKey;
  if (!apiKey) return null;

  const apiUrl = xaiKey
    ? "https://api.x.ai/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  const model = xaiKey
    ? process.env.XAI_MODEL ?? "grok-3-mini"
    : process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You assess job scam risk. Never declare a job legitimate with certainty. Return JSON only with riskLevel (LOW, MEDIUM, HIGH), score (0-100), reasons (array of short strings), and summary (one sentence). Consider payment requests, identity/banking requests, unrealistic pay, impersonation, missing company details, and suspicious contact methods.",
        },
        {
          role: "user",
          content: JSON.stringify({ jobUrl, pageText, initialRuleFindings: ruleResult.reasons }),
        },
      ],
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) throw new Error(`Groq returned ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Groq returned no analysis");
  const result = JSON.parse(content) as VerificationResult;
  if (!["LOW", "MEDIUM", "HIGH"].includes(result.riskLevel)) throw new Error("Invalid AI risk level");
  return {
    riskLevel: result.riskLevel,
    score: Math.max(0, Math.min(100, Number(result.score))),
    reasons: Array.isArray(result.reasons) ? result.reasons.slice(0, 8).map(String) : [],
    summary: String(result.summary ?? "AI review completed."),
  } satisfies VerificationResult;
}

export async function verifyJob(jobUrl: string): Promise<VerificationResult> {
  let pageText = "";
  try {
    pageText = await fetchPageText(jobUrl);
  } catch (error) {
    pageText = `Unable to fetch page for automated review: ${error instanceof Error ? error.message : "unknown error"}`;
  }

  const ruleResult = runRules(jobUrl, pageText);
  try {
    const aiResult = await runGroq(jobUrl, pageText, ruleResult);
    if (aiResult) return aiResult;
  } catch {
    // Keep the report available for manual investigation if the AI service is unavailable.
  }
  return ruleResult;
}