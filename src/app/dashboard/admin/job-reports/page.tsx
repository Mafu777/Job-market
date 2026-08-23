"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  jobUrl: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  contactMethod: string;
  concern: string;
  status: string;
  aiRiskLevel: string;
  aiRiskScore: number | null;
  aiReasons: string[];
  aiSummary: string | null;
  scamRadarPublished: boolean;
  reporterFeedback: string | null;
  feedbackDeliveryStatus: string;
  feedbackSentAt: string | null;
  investigatorNotes: string | null;
  createdAt: string;
  job: { title: string } | null;
};

const statuses = ["PENDING", "INVESTIGATING", "VERIFIED", "SUSPICIOUS", "SCAM", "CLOSED"];

export default function AdminJobReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState("");

  async function loadReports() {
    const response = await fetch("/api/admin/job-reports");
    if (!response.ok) {
      setError("Could not load job reports.");
      return;
    }
    setReports((await response.json()).reports);
  }

  useEffect(() => {
    void Promise.resolve().then(loadReports);
  }, []);

  async function updateReport(report: Report, status: string, notes: string, feedback = "", publishToScamRadar = false) {
    const response = await fetch("/api/admin/job-reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: report.id, status, notes, feedback, sendFeedback: Boolean(feedback), publishToScamRadar }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Could not update this report.");
    }
    else await loadReports();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Job reports</h1>
      <p className="mt-1 text-sm text-gray-600">Investigate reports, record findings, and contact the reporter outside this dashboard.</p>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-6 space-y-5">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} onUpdate={updateReport} />
        ))}
        {reports.length === 0 && <p className="text-gray-500">No reports have been submitted.</p>}
      </div>
    </main>
  );
}

function ReportCard({ report, onUpdate }: { report: Report; onUpdate: (report: Report, status: string, notes: string, feedback?: string, publishToScamRadar?: boolean) => Promise<void> }) {
  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState(report.investigatorNotes ?? "");
  const [feedback, setFeedback] = useState("");
  const [publishToScamRadar, setPublishToScamRadar] = useState(report.scamRadarPublished);
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{report.job?.title ?? "External job"}</h2>
          <a href={report.jobUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-blue-600 hover:underline">{report.jobUrl}</a>
        </div>
        <time className="text-xs text-gray-500" dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleString()}</time>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700">{report.concern}</p>
      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
        <p className="font-semibold text-gray-900">
          Automated assessment: {report.aiRiskLevel}
          {report.aiRiskScore !== null ? ` (${report.aiRiskScore}/100)` : ""}
        </p>
        {report.aiSummary && <p className="mt-1 text-gray-700">{report.aiSummary}</p>}
        {report.aiReasons.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
            {report.aiReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
        <p className="mt-2 text-xs text-gray-500">Automated results are indicators only. Confirm findings manually before contacting the reporter.</p>
      </div>
      <p className="mt-3 text-sm text-gray-600">Reporter: {report.name || "Anonymous"} · {report.email || "No email"} · {report.phone || "No phone"} · prefers {report.contactMethod.toLowerCase()}</p>
      <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={publishToScamRadar} onChange={(event) => setPublishToScamRadar(event.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        Add this investigated report to Scam Radar (requires Suspicious or Scam status)
      </label>
      {report.feedbackSentAt && <p className="mt-2 text-sm text-green-700">Feedback sent via {report.feedbackDeliveryStatus.toLowerCase()} on {new Date(report.feedbackSentAt).toLocaleString()}.</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr_auto]">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          {statuses.map((value) => <option key={value}>{value}</option>)}
        </select>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Internal investigation notes" rows={2} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={() => onUpdate(report, status, notes, "", publishToScamRadar)} className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">Save review</button>
      </div>
      <div className="mt-3 flex gap-3">
        <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Feedback to send to the reporter" rows={2} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button onClick={() => onUpdate(report, status, notes, feedback, publishToScamRadar)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save and send feedback</button>
      </div>
    </article>
  );
}
