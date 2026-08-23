import { NextResponse } from "next/server";
import { fallbackCareerContent, generateCareerContent } from "@/lib/career-ai";

const modes = ["cv", "cover-letter", "interview"] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !modes.includes(body.mode)) {
    return NextResponse.json({ error: "Choose a valid career tool." }, { status: 400 });
  }

  const input = {
    mode: body.mode,
    name: typeof body.name === "string" ? body.name.trim() : "",
    targetRole: typeof body.targetRole === "string" ? body.targetRole.trim() : "",
    jobDescription: typeof body.jobDescription === "string" ? body.jobDescription.trim() : "",
    experience: typeof body.experience === "string" ? body.experience.trim() : "",
    skills: typeof body.skills === "string" ? body.skills.trim() : "",
  };

  if (!input.targetRole) {
    return NextResponse.json({ error: "Enter the role you are targeting." }, { status: 400 });
  }

  try {
    const content = await generateCareerContent(input);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: fallbackCareerContent(input), fallback: true });
  }
}
