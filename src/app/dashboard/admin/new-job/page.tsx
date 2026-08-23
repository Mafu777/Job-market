"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JobType, ExperienceLevel, JobStatus } from "@/types";

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "ENTRY", label: "Entry level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID", label: "Mid-level" },
  { value: "SENIOR", label: "Senior" },
  { value: "EXECUTIVE", label: "Executive" },
];

interface Company {
  id: string;
  name: string;
  location: string | null;
  verified: boolean;
}

export default function AdminNewJobPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyLocation, setNewCompanyLocation] = useState("");
  const [newCompanyLogoUrl, setNewCompanyLogoUrl] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [jobType, setJobType] = useState<JobType>("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("MID");
  const [category, setCategory] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies ?? []))
      .catch(() => setError("Could not load companies."))
      .finally(() => setLoadingCompanies(false));
  }, []);

  async function ensureCompanyId(): Promise<string | null> {
    if (!showNewCompany) return companyId || null;

    if (!newCompanyName.trim()) {
      setError("Enter a company name.");
      return null;
    }

    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCompanyName,
        location: newCompanyLocation,
        logoUrl: newCompanyLogoUrl,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create company.");
      return null;
    }

    const created = await res.json();
    return created.id;
  }

  async function handleSubmit(status: JobStatus) {
    setError("");
    setSubmitting(true);

    const resolvedCompanyId = await ensureCompanyId();
    if (!resolvedCompanyId) {
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: resolvedCompanyId,
          title,
          description,
          requirements,
          imageUrl,
          location,
          remote,
          jobType,
          experienceLevel,
          category,
          salaryMin: salaryMin ? parseInt(salaryMin, 10) : undefined,
          salaryMax: salaryMax ? parseInt(salaryMax, 10) : undefined,
          applicationUrl,
          featured,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/dashboard/admin");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Post a job (Admin)</h1>
      <p className="mt-1 text-sm text-gray-600">
        Post a job under any existing company, or create a new one on the fly.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("PUBLISHED");
        }}
        className="mt-8 space-y-5"
      >
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="block text-sm font-medium text-gray-700">Company</label>

          {!showNewCompany ? (
            <>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                disabled={loadingCompanies}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  {loadingCompanies ? "Loading companies..." : "Select a company"}
                </option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.location ? ` — ${c.location}` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCompany(true)}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline"
              >
                + Add a new company instead
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company name"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={newCompanyLocation}
                onChange={(e) => setNewCompanyLocation(e.target.value)}
                placeholder="Company location (optional)"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <input
                type="url"
                value={newCompanyLogoUrl}
                onChange={(e) => setNewCompanyLogoUrl(e.target.value)}
                placeholder="Company logo or image URL (optional)"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewCompany(false)}
                className="mt-2 text-sm font-medium text-blue-600 hover:underline"
              >
                Choose an existing company instead
              </button>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={8}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Qualifications, experience, skills, documents, and other requirements..."
            rows={6}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job image or logo</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 1024 * 1024) {
                setError("Please choose an image smaller than 1 MB.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setImageUrl(String(reader.result));
              reader.readAsDataURL(file);
            }}
            className="mt-1 block w-full text-sm text-gray-600"
          />
          <p className="mt-1 text-xs text-gray-500">Upload a PNG, JPG, or WebP image up to 1 MB. It will appear next to the job.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Johannesburg, Gauteng"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Software Development"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum salary (ZAR/month)
            </label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 25000"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum salary (ZAR/month)
            </label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g. 40000"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            External application link
          </label>
          <input
            type="url"
            value={applicationUrl}
            onChange={(e) => setApplicationUrl(e.target.value)}
            placeholder="https://company.com/careers/job-application"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Applicants will be sent to this link when they click Apply Now.
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remote}
              onChange={(e) => setRemote(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            This role can be done remotely
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Mark as featured
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("DRAFT")}
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish job"}
          </button>
        </div>
      </form>
    </main>
  );
}
