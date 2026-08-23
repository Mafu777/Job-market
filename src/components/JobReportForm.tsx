"use client";

import { FormEvent, useState } from "react";

export default function JobReportForm({ title, description }: { title: string; description: string }) {
  const [form, setForm] = useState({ jobUrl: "", name: "", email: "", phone: "", contactMethod: "EITHER", concern: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/job-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "We could not submit your report.");
        return;
      }
      setMessage("Thank you. Our team will investigate this job and contact you with an update.");
      setForm({ jobUrl: "", name: "", email: "", phone: "", contactMethod: "EITHER", concern: "" });
    } catch {
      setError("We could not submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">{description}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job link</label>
          <input type="url" value={form.jobUrl} onChange={(event) => update("jobUrl", event.target.value)} placeholder="https://example.com/job" className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">What should we investigate?</label>
          <textarea value={form.concern} onChange={(event) => update("concern", event.target.value)} placeholder="Describe the suspicious request, payment demand, contact, or other concern." rows={6} className={inputClass} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your name (optional)</label>
            <input type="text" value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={inputClass} placeholder="+27 ..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred follow-up</label>
            <select value={form.contactMethod} onChange={(event) => update("contactMethod", event.target.value)} className={inputClass}>
              <option value="EITHER">Email or phone</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500">Provide at least one contact method. We use these details only to respond to your report as described in our privacy policy.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {submitting ? "Sending report..." : "Submit for investigation"}
        </button>
      </form>
    </main>
  );
}
