import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJob } from "@/lib/job-verification";
import { sendReportEmail } from "@/lib/report-feedback";

const contactMethods = ["EMAIL", "PHONE", "EITHER"] as const;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const jobUrl = typeof body?.jobUrl === "string" ? body.jobUrl.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  const phone = typeof body?.phone === "string" ? body.phone.trim() : null;
  const concern = typeof body?.concern === "string" ? body.concern.trim() : "";
  const contactMethod = body?.contactMethod;

  if (!jobUrl || !concern || !contactMethods.includes(contactMethod)) {
    return NextResponse.json(
      { error: "Job link, concern, and a contact preference are required." },
      { status: 400 }
    );
  }

  try {
    const parsedUrl = new URL(jobUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Enter a valid HTTP or HTTPS job link." }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Provide an email address or phone number so we can follow up." },
      { status: 400 }
    );
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const job = await prisma.job.findFirst({
    where: { applicationUrl: jobUrl },
    select: { id: true },
  });

  const verification = await verifyJob(jobUrl);

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { email: true },
  });
  const adminEmail = process.env.ADMIN_REPORT_EMAIL ?? admin?.email;
  let adminNotifiedAt: Date | undefined;
  let adminNotificationError: string | undefined;

  if (adminEmail) {
    try {
      await sendReportEmail({
        to: adminEmail,
        subject: `New job report: ${verification.riskLevel} risk`,
        message: [
          "A new job report was submitted to JobConnect SA.",
          `Job link: ${jobUrl}`,
          `Reporter: ${name || "Anonymous"}`,
          `Email: ${email || "Not provided"}`,
          `Phone: ${phone || "Not provided"}`,
          `Concern: ${concern}`,
          `Automated assessment: ${verification.riskLevel}${verification.score !== null ? ` (${verification.score}/100)` : ""}`,
          `Reasons: ${verification.reasons.join("; ") || "No specific indicators detected."}`,
          "Review the report in the admin dashboard before responding.",
        ].join("\n\n"),
      });
      adminNotifiedAt = new Date();
    } catch (error) {
      adminNotificationError = error instanceof Error ? error.message : "Admin notification failed.";
    }
  } else {
    adminNotificationError = "No admin email is configured.";
  }

  const report = await prisma.jobReport.create({
    data: {
      jobUrl,
      jobId: job?.id,
      name: name || null,
      email,
      phone: phone || null,
      contactMethod,
      concern,
      aiRiskLevel: verification.riskLevel,
      aiRiskScore: verification.score,
      aiReasons: verification.reasons,
      aiSummary: verification.summary,
      adminNotifiedAt,
      adminNotificationError,
    },
  });

  return NextResponse.json({ id: report.id }, { status: 201 });
}
