import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyWhatsAppSubscribers } from "@/lib/whatsapp";

// POST /api/admin/jobs — admin creates a job under any company
export async function POST(req: Request) {
const session = await getServerSession(authOptions);

// @ts-expect-error role added via callbacks
if (!session || session.user.role !== "ADMIN") {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const body = await req.json();
const { companyId, ...jobFields } = body;

if (!companyId) {
return NextResponse.json({ error: "companyId is required" }, { status: 400 });
}

if (!jobFields.applicationUrl) {
return NextResponse.json({ error: "An application URL is required" }, { status: 400 });
}

if (!jobFields.title || !jobFields.description || !jobFields.location || !jobFields.category || !jobFields.requirements) {
return NextResponse.json({ error: "Title, description, location, category, and requirements are required" }, { status: 400 });
}

try {
const applicationUrl = new URL(jobFields.applicationUrl);
if (!["http:", "https:"].includes(applicationUrl.protocol)) {
throw new Error("Unsupported protocol");
}
} catch {
return NextResponse.json({ error: "Application URL must be a valid HTTP or HTTPS link" }, { status: 400 });
}

const company = await prisma.company.findUnique({ where: { id: companyId } });
if (!company) {
return NextResponse.json({ error: "Company not found" }, { status: 404 });
}

const job = await prisma.job.create({
data: {
companyId,
title: jobFields.title,
description: jobFields.description,
requirements: jobFields.requirements,
imageUrl: jobFields.imageUrl || null,
location: jobFields.location,
remote: jobFields.remote ?? false,
jobType: jobFields.jobType,
experienceLevel: jobFields.experienceLevel,
salaryMin: jobFields.salaryMin,
salaryMax: jobFields.salaryMax,
category: jobFields.category,
status: jobFields.status ?? "DRAFT",
featured: jobFields.featured ?? false,
applicationUrl: jobFields.applicationUrl || null,
publishedAt: jobFields.status === "PUBLISHED" ? new Date() : null,
},
});

if (job.status === "PUBLISHED") {
void notifyWhatsAppSubscribers({ ...job, company });
}

return NextResponse.json(job, { status: 201 });
}