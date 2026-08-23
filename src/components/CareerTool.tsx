"use client";

import { FormEvent, useState } from "react";

type Tool = "cv" | "cover-letter" | "interview";

const copy = {
  cv: {
    title: "CV Builder",
    description: "Create a clear, job-focused CV draft from your real experience.",
    action: "Build my CV",
    result: "Your CV draft",
  },
  "cover-letter": {
    title: "Cover Letter",
    description: "Tailor a professional cover letter to the role you want.",
    action: "Write my cover letter",
    result: "Your cover letter",
  },
  interview: {
    title: "Interview Preparation",
    description: "Prepare focused answers and questions for your next interview.",
    action: "Prepare me",
    result: "Your interview plan",
  },
} as const;

export default function CareerTool({ tool }: { tool: Tool }) {
  const [form, setForm] = useState({ name: "", targetRole: "", experience: "", skills: "", jobDescription: "" });
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const details = copy[tool];

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setContent("");
    setLoading(true);
    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: tool }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Could not generate content.");
      else setContent(data.content);
    } catch {
      setError("Could not reach the career assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{details.title}</h1>
      <p className="mt-2 text-gray-600">{details.description}</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" value={form.name} onChange={(value) => update("name", value)} placeholder="e.g. Thandi Mokoena" />
          <Field label="Target role" value={form.targetRole} onChange={(value) => update("targetRole", value)} placeholder="e.g. Junior Data Analyst" required />
        </div>
        <Field label="Experience and education" value={form.experience} onChange={(value) => update("experience", value)} placeholder="Include your roles, achievements, qualifications and dates." textarea />
        <Field label="Skills" value={form.skills} onChange={(value) => update("skills", value)} placeholder="Separate skills with commas." />
        {tool !== "cv" && <Field label="Job description (optional)" value={form.jobDescription} onChange={(value) => update("jobDescription", value)} placeholder="Paste the vacancy description for a more tailored result." textarea />}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Preparing..." : details.action}
        </button>
      </form>
      {content && (
        <section className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{details.result}</h2>
            <button type="button" onClick={() => navigator.clipboard.writeText(content)} className="text-sm font-medium text-blue-600 hover:underline">Copy</button>
          </div>
          <pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7 text-gray-700">{content}</pre>
          <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">Review every detail before using this draft. Replace placeholders with your own truthful information.</p>
        </section>
      )}
    </main>
  );
}

function Field({ label, value, onChange, placeholder, textarea = false, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; textarea?: boolean; required?: boolean }) {
  const className = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={6} className={className} required={required} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} required={required} />}
    </div>
  );
}
