import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Scam Radar | JobConnect SA",
  description: "See job links investigated and flagged by the JobConnect SA safety team.",
};

export default async function ScamRadarPage() {
  const reports = await prisma.jobReport.findMany({
    where: { scamRadarPublished: true },
    select: { id: true, jobUrl: true, concern: true, status: true, aiSummary: true, scamRadarPublishedAt: true },
    orderBy: { scamRadarPublishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Scam Radar</h1>
      <p className="mt-3 text-gray-600">These job links have been reviewed and published by our safety team as suspicious or confirmed scams. A listing is not shown here from a public report alone.</p>
      <div className="mt-8 space-y-5">
        {reports.map((report) => (
          <article key={report.id} className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">{report.status === "SCAM" ? "Confirmed scam" : "Suspicious job"}</span>
              {report.scamRadarPublishedAt && <time className="text-xs text-gray-500">Published {new Date(report.scamRadarPublishedAt).toLocaleDateString()}</time>}
            </div>
            <a href={report.jobUrl} target="_blank" rel="noreferrer" className="mt-3 block break-all font-medium text-blue-700 hover:underline">{report.jobUrl}</a>
            {report.aiSummary && <p className="mt-3 text-sm text-gray-700">{report.aiSummary}</p>}
            <p className="mt-3 text-sm text-gray-600">Investigation note: {report.concern}</p>
          </article>
        ))}
        {reports.length === 0 && <p className="text-gray-500">No investigated jobs have been added to Scam Radar yet.</p>}
      </div>
      <p className="mt-8 text-sm text-gray-500">Scam Radar is an alert service, not a complete list of every fraudulent job. Always avoid paying to apply and verify employers independently.</p>
    </main>
  );
}