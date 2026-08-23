type CareerMode = "cv" | "cover-letter" | "interview";

type CareerInput = {
  mode: CareerMode;
  name: string;
  targetRole: string;
  jobDescription: string;
  experience: string;
  skills: string;
};

export function fallbackCareerContent(input: CareerInput) {
  if (input.mode === "cv") {
    return `PROFESSIONAL SUMMARY\n\nMotivated ${input.targetRole || "professional"} with experience in ${input.experience || "relevant work and projects"}. Skilled in ${input.skills || "communication, problem-solving and teamwork"}.\n\nCORE SKILLS\n\n${input.skills || "Add your strongest job-related skills here."}\n\nEXPERIENCE\n\n${input.experience || "Add your most recent experience, achievements and responsibilities here."}\n\nNEXT STEPS\n\nReplace each placeholder with specific achievements and measurable results.`;
  }

  if (input.mode === "cover-letter") {
    return `Dear Hiring Manager,\n\nI am writing to apply for the ${input.targetRole || "position"}. My experience in ${input.experience || "relevant work"} and skills in ${input.skills || "communication and problem-solving"} would allow me to contribute effectively to your team.\n\nI am particularly interested in this opportunity because it matches my career goals and gives me the chance to apply my strengths in a practical environment.\n\nThank you for considering my application. I would welcome the opportunity to discuss how my experience can support your organisation.\n\nKind regards,\n${input.name || "Your name"}`;
  }

  return `INTERVIEW PREPARATION: ${input.targetRole || "Target role"}\n\n1. Tell us about yourself.\nConnect your background, strongest skills and interest in this role.\n\n2. Why do you want this job?\nUse the job description to explain the match between your goals and the employer's needs.\n\n3. Describe a challenge you solved.\nAnswer with Situation, Task, Action and Result.\n\n4. What are your strengths?\nChoose two strengths relevant to ${input.targetRole || "the role"} and give examples.\n\n5. What questions do you have for us?\nAsk about success in the role, team expectations and the next steps.\n\nPreparation focus: ${input.skills || "Review the required skills and prepare specific examples from your experience."}`;
}

export async function generateCareerContent(input: CareerInput) {
  const apiKey = process.env.XAI_API_KEY?.trim() || process.env.GROQ_API_KEY?.trim();
  const isPlaceholder = !apiKey || apiKey.includes("your_") || apiKey.includes("replace_");
  if (isPlaceholder) return fallbackCareerContent(input);

  const isXai = Boolean(process.env.XAI_API_KEY?.trim() && !process.env.XAI_API_KEY.includes("your_"));
  try {
    const response = await fetch(
      isXai ? "https://api.x.ai/v1/chat/completions" : "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: isXai ? process.env.XAI_MODEL ?? "grok-3-mini" : process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: "You are a practical South African career coach. Produce useful, truthful career material. Never invent employers, qualifications, dates, achievements, salary figures, or experience. Clearly mark anything the user must complete. Return plain text with readable headings.",
            },
            {
              role: "user",
              content: JSON.stringify(input),
            },
          ],
        }),
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) return fallbackCareerContent(input);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content : fallbackCareerContent(input);
  } catch {
    return fallbackCareerContent(input);
  }
}
