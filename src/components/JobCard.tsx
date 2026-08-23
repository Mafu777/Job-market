import Link from "next/link";
import Image from "next/image";
import { JobCardData } from "@/types";

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  const fmt = (n: number) => `R${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt((min ?? max) as number);
}

export default function JobCard({ job }: { job: JobCardData }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {job.imageUrl || job.companyLogoUrl ? (
            <Image src={(job.imageUrl || job.companyLogoUrl) as string} alt="" width={44} height={44} unoptimized className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 object-contain p-1" />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{job.companyName.charAt(0)}</div>
          )}
          <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.companyName}</p>
          </div>
        </div>
        {job.featured && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            Featured
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="rounded-full bg-gray-100 px-2.5 py-1">
          {job.location}
          {job.remote ? " · Remote" : ""}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1">
          {job.jobType.replace("_", " ")}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1">{job.category}</span>
      </div>

      {salary && (
        <p className="mt-3 text-sm font-medium text-green-700">{salary} / month</p>
      )}
    </Link>
  );
}
