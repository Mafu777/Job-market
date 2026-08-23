import JobCard from "@/components/JobCard";
import { JobCardData } from "@/types";

async function getJobs(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/jobs?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return [] as JobCardData[];
  const data = await res.json();

  return data.jobs.map((job: never) => ({
    id: (job as { id: string }).id,
    title: (job as { title: string }).title,
    companyName: (job as { company: { name: string } }).company.name,
    companyLogoUrl: (job as { company: { logoUrl: string | null } }).company.logoUrl,
    imageUrl: (job as { imageUrl: string | null }).imageUrl,
    location: (job as { location: string }).location,
    remote: (job as { remote: boolean }).remote,
    jobType: (job as { jobType: JobCardData["jobType"] }).jobType,
    experienceLevel: (job as { experienceLevel: JobCardData["experienceLevel"] })
      .experienceLevel,
    salaryMin: (job as { salaryMin: number | null }).salaryMin,
    salaryMax: (job as { salaryMax: number | null }).salaryMax,
    category: (job as { category: string }).category,
    featured: (job as { featured: boolean }).featured,
  })) as JobCardData[];
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const jobs = await getJobs(await searchParams);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900">
        {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
      </h1>

      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

        {jobs.length === 0 && (
          <p className="text-gray-500">No jobs match your search yet. Check back soon.</p>
        )}
      </div>
    </main>
  );
}
