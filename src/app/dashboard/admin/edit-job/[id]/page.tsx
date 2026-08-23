"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ title: "", description: "", requirements: "", location: "", category: "", jobType: "FULL_TIME", experienceLevel: "MID", salaryMin: "", salaryMax: "", applicationUrl: "", imageUrl: "", remote: false, featured: false, status: "PUBLISHED" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/jobs/${id}`).then((response) => response.json()).then((data) => {
      if (!data.job) { setError(data.error ?? "Job not found."); return; }
      const value = data.job as Record<string, unknown>;
      setJob(value);
      setForm({ title: String(value.title ?? ""), description: String(value.description ?? ""), requirements: String(value.requirements ?? ""), location: String(value.location ?? ""), category: String(value.category ?? ""), jobType: String(value.jobType ?? "FULL_TIME"), experienceLevel: String(value.experienceLevel ?? "MID"), salaryMin: value.salaryMin ? String(value.salaryMin) : "", salaryMax: value.salaryMax ? String(value.salaryMax) : "", applicationUrl: String(value.applicationUrl ?? ""), imageUrl: String(value.imageUrl ?? ""), remote: Boolean(value.remote), featured: Boolean(value.featured), status: String(value.status ?? "PUBLISHED") });
    }).catch(() => setError("Could not load this job."));
  }, [id]);

  function update(field: string, value: string | boolean) { setForm((current) => ({ ...current, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    const response = await fetch(`/api/admin/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "Could not save this job."); setSaving(false); return; }
    router.push("/dashboard/admin");
  }

  if (!job && !error) return <main className="mx-auto max-w-2xl px-6 py-12 text-gray-600">Loading job...</main>;
  const input = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none";
  return <main className="mx-auto max-w-2xl px-6 py-12"><h1 className="text-2xl font-bold text-gray-900">Edit job</h1><p className="mt-1 text-sm text-gray-600">Update the listing details, requirements, application link, or image.</p><div className="mt-8 space-y-5">
    <Field label="Job title" value={form.title} update={(value) => update("title", value)} className={input} />
    <Field label="Description" value={form.description} update={(value) => update("description", value)} className={input} textarea />
    <Field label="Requirements" value={form.requirements} update={(value) => update("requirements", value)} className={input} textarea />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Location" value={form.location} update={(value) => update("location", value)} className={input} /><Field label="Category" value={form.category} update={(value) => update("category", value)} className={input} /></div>
    <div className="grid gap-4 sm:grid-cols-2"><Select label="Job type" value={form.jobType} values={["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "TEMPORARY"]} update={(value) => update("jobType", value)} className={input} /><Select label="Experience level" value={form.experienceLevel} values={["ENTRY", "JUNIOR", "MID", "SENIOR", "EXECUTIVE"]} update={(value) => update("experienceLevel", value)} className={input} /></div>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Minimum salary" value={form.salaryMin} update={(value) => update("salaryMin", value)} className={input} /><Field label="Maximum salary" value={form.salaryMax} update={(value) => update("salaryMax", value)} className={input} /></div>
    <Field label="Application link" value={form.applicationUrl} update={(value) => update("applicationUrl", value)} className={input} />
    <div><label className="block text-sm font-medium text-gray-700">Replace job image</label><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 1024 * 1024) { setError("Please choose an image smaller than 1 MB."); return; } const reader = new FileReader(); reader.onload = () => update("imageUrl", String(reader.result)); reader.readAsDataURL(file); }} className="mt-1 block w-full text-sm text-gray-600" /></div>
    <Select label="Status" value={form.status} values={["DRAFT", "PUBLISHED", "CLOSED"]} update={(value) => update("status", value)} className={input} />
    <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.remote} onChange={(event) => update("remote", event.target.checked)} /> Remote role</label><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured job</label>
    {error && <p className="text-sm text-red-600">{error}</p>}<button type="button" onClick={save} disabled={saving} className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
  </div></main>;
}

function Field({ label, value, update, className, textarea = false }: { label: string; value: string; update: (value: string) => void; className: string; textarea?: boolean }) { return <div><label className="block text-sm font-medium text-gray-700">{label}</label>{textarea ? <textarea value={value} onChange={(event) => update(event.target.value)} rows={6} className={className} required /> : <input value={value} onChange={(event) => update(event.target.value)} className={className} required />}</div>; }
function Select({ label, value, values, update, className }: { label: string; value: string; values: string[]; update: (value: string) => void; className: string }) { return <div><label className="block text-sm font-medium text-gray-700">{label}</label><select value={value} onChange={(event) => update(event.target.value)} className={className}>{values.map((item) => <option key={item}>{item}</option>)}</select></div>; }
