import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendReportFeedback } from "@/lib/report-feedback";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error role added via callbacks
  return session?.user.role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reports = await prisma.jobReport.findMany({ orderBy: { createdAt: "desc" }, include: { job: { select: { title: true } } } });
  return NextResponse.json({ reports });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status;
  const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";
  const sendFeedback = body?.sendFeedback === true;
  const publishToScamRadar = body?.publishToScamRadar === true;
  const allowedStatuses = ["PENDING", "INVESTIGATING", "VERIFIED", "SUSPICIOUS", "SCAM", "CLOSED"];
  if (!id || !allowedStatuses.includes(status)) return NextResponse.json({ error: "A valid report and status are required." }, { status: 400 });
  if (publishToScamRadar && !["SUSPICIOUS", "SCAM"].includes(status)) {
    return NextResponse.json({ error: "Only suspicious or scam reports can be published to Scam Radar." }, { status: 400 });
  }

  const existing = await prisma.jobReport.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Report not found." }, { status: 404 });

  let feedbackDeliveryStatus: "NOT_SENT" | "SENT" | "FAILED" = "NOT_SENT";
  if (sendFeedback) {
    if (!feedback) return NextResponse.json({ error: "Enter feedback before sending it." }, { status: 400 });
    try {
      await sendReportFeedback({
        email: existing.email,
        phone: existing.phone,
        contactMethod: existing.contactMethod,
        subject: `Update on your JobConnect SA report`,
        message: feedback,
      });
      feedbackDeliveryStatus = "SENT";
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Feedback could not be sent." }, { status: 502 });
    }
  }

  const report = await prisma.jobReport.update({
    where: { id },
    data: {
      status,
      investigatorNotes: typeof body.notes === "string" ? body.notes.trim() || null : undefined,
      reporterFeedback: sendFeedback ? feedback : undefined,
      feedbackDeliveryStatus,
      feedbackSentAt: sendFeedback ? new Date() : undefined,
      reviewedAt: ["VERIFIED", "SUSPICIOUS", "SCAM", "CLOSED"].includes(status) ? new Date() : null,
      scamRadarPublished: publishToScamRadar,
      scamRadarPublishedAt: publishToScamRadar ? new Date() : null,
    },
  });
  return NextResponse.json(report);
}
