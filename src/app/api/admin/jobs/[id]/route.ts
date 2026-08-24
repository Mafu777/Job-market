import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyWhatsAppSubscribers } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error role added via callbacks
  return session?.user.role === "ADMIN";
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const requiredFields = ["title", "description", "location", "category", "requirements", "applicationUrl"];
  if (requiredFields.some((field) => typeof body?.[field] !== "string" || !body[field].trim())) {
    return NextResponse.json({ error: "Title, description, location, category, requirements, and application link are required" }, { status: 400 });
  }

  const existingJob = await prisma.job.findUnique({
    where: { id },
    include: { company: { select: { name: true } } },
  });
  if (!existingJob) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  try {
    const url = new URL(body.applicationUrl);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Application link must be a valid HTTP or HTTPS URL" }, { status: 400 });
  }

  const job = await prisma.job.update({
    where: { id },
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      requirements: body.requirements.trim(),
      location: body.location.trim(),
      category: body.category.trim(),
      remote: Boolean(body.remote),
      jobType: body.jobType,
      experienceLevel: body.experienceLevel,
      salaryMin: body.salaryMin === "" ? null : Number(body.salaryMin) || null,
      salaryMax: body.salaryMax === "" ? null : Number(body.salaryMax) || null,
      applicationUrl: body.applicationUrl.trim(),
      imageUrl: typeof body.imageUrl === "string" && body.imageUrl.startsWith("data:image/") ? body.imageUrl : null,
      featured: Boolean(body.featured),
      status: body.status,
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });
  if (existingJob.status !== "PUBLISHED" && job.status === "PUBLISHED") {
    void notifyWhatsAppSubscribers({ ...job, company: existingJob.company });
  }
  return NextResponse.json({ job });
}
