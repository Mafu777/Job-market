import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const job = await prisma.job.findUnique({
where: { id },
include: { company: true },
});

if (!job) notFound();

return (
<main className="mx-auto max-w-3xl px-6 py-12">
<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
<h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
{(job.imageUrl || job.company.logoUrl) && <Image src={(job.imageUrl || job.company.logoUrl) as string} alt={`${job.company.name} logo`} width={64} height={64} unoptimized className="mt-4 h-16 w-16 rounded-lg border border-gray-100 object-contain p-2" />}
<p className="mt-1 text-gray-600">
{job.company.name} · {job.location}
</p>

<div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
<span className="rounded-full bg-gray-100 px-2.5 py-1">
{job.jobType.replace("_", " ")}
</span>
<span className="rounded-full bg-gray-100 px-2.5 py-1">
{job.experienceLevel}
</span>
{job.remote && (
<span className="rounded-full bg-gray-100 px-2.5 py-1">Remote</span>
)}
</div>

<div className="prose mt-6 max-w-none whitespace-pre-wrap text-gray-800">
{job.description}
</div>

<h2 className="mt-8 text-lg font-semibold text-gray-900">Requirements</h2>
<div className="mt-3 whitespace-pre-wrap text-gray-700">{job.requirements || "Please review the full job description for requirements."}</div>

<div className="mt-8">
{job.applicationUrl ? (
<a
href={job.applicationUrl}
target="_blank"
rel="noopener noreferrer"
className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
>
Apply Now
</a>
) : (
<p className="text-sm text-gray-500">
Application details coming soon. Please check back later.
</p>
)}
</div>
</div>
</main>
);
}