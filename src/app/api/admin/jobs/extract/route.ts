import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const EXTRACTION_PROMPT = `Extract a job advertisement into JSON. Use only information present in the source; do not invent values. Return exactly one JSON object with these keys:
companyName, companyLocation, title, description, requirements, location, remote, jobType, experienceLevel, category, salaryMin, salaryMax, applicationUrl.
Use null for unknown strings or numbers. remote must be a boolean. jobType must be one of FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, TEMPORARY; choose FULL_TIME only when the source clearly indicates full-time, otherwise use null. experienceLevel must be one of ENTRY, JUNIOR, MID, SENIOR, EXECUTIVE, or null. Keep description and requirements as readable plain text. Do not include markdown or extra commentary.`;

function cleanJson(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] ?? content;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("The AI response was not valid JSON.");
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // @ts-expect-error role added via callbacks
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.XAI_API_KEY?.trim() || process.env.GROQ_API_KEY?.trim();
  const isXai = Boolean(process.env.XAI_API_KEY?.trim() && !process.env.XAI_API_KEY.includes("your_"));
  if (!apiKey || apiKey.includes("your_") || apiKey.includes("replace_")) {
    return NextResponse.json({ error: "Add a working GROQ_API_KEY or XAI_API_KEY first." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const sourceText = typeof body.text === "string" ? body.text.trim() : "";
  const image = typeof body.image === "string" && body.image.startsWith("data:image/") ? body.image : "";
  if (!sourceText && !image) {
    return NextResponse.json({ error: "Paste job details or upload an advertisement image." }, { status: 400 });
  }
  if (sourceText.length > 30000 || image.length > 3_000_000) {
    return NextResponse.json({ error: "The source is too large. Use less text or an image under 2 MB." }, { status: 413 });
  }

  const messages = [
    { role: "system", content: EXTRACTION_PROMPT },
    {
      role: "user",
      content: image
        ? [
            { type: "text", text: sourceText || "Extract the details from this job advertisement image." },
            { type: "image_url", image_url: { url: image } },
          ]
        : sourceText,
    },
  ];

  try {
    const response = await fetch(
      isXai ? "https://api.x.ai/v1/chat/completions" : "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: isXai ? process.env.XAI_MODEL ?? "grok-3-mini" : process.env.GROQ_VISION_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct",
          temperature: 0.1,
          messages,
        }),
        signal: AbortSignal.timeout(30000),
      }
    );
    if (!response.ok) return NextResponse.json({ error: "The extraction service could not process this job." }, { status: 502 });
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("Missing extraction response.");
    return NextResponse.json({ job: cleanJson(content) });
  } catch {
    return NextResponse.json({ error: "Could not extract the job details. Check the source and try again." }, { status: 502 });
  }
}