import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // @ts-expect-error role added via callbacks
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [userCount, jobCount, applicationCount, pendingReportCount, jobs] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.jobReport.count({ where: { status: { in: ["PENDING", "INVESTIGATING"] } } }),
    prisma.job.findMany({ include: { company: true }, orderBy: { updatedAt: "desc" }, take: 30 }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <Link
          href="/dashboard/admin/new-job"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Post a job
        </Link>
        <Link
          href="/dashboard/admin/job-reports"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Job reports ({pendingReportCount})
        </Link>
        <Link
          href="/dashboard/admin/team"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Manage team
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">{userCount}</p>
          <p className="text-sm text-gray-500">Users</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">{jobCount}</p>
          <p className="text-sm text-gray-500">Jobs</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-3xl font-bold text-gray-900">{applicationCount}</p>
          <p className="text-sm text-gray-500">Applications</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your job listings</h2>
          <span className="text-sm text-gray-500">Edit details, images, requirements, and links</span>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600"><tr><th className="px-5 py-3 font-semibold">Job</th><th className="px-5 py-3 font-semibold">Company</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Action</th></tr></thead>
            <tbody>{jobs.map((job) => <tr key={job.id} className="border-b border-gray-100 last:border-0"><td className="px-5 py-4 font-medium text-gray-900">{job.title}</td><td className="px-5 py-4 text-gray-600">{job.company.name}</td><td className="px-5 py-4 text-gray-600">{job.status}</td><td className="px-5 py-4"><Link href={`/dashboard/admin/edit-job/${job.id}`} className="font-semibold text-blue-700 hover:underline">Edit job</Link></td></tr>)}</tbody>
          </table>
          {jobs.length === 0 && <p className="p-5 text-sm text-gray-500">No jobs posted yet.</p>}
        </div>
      </section>
    </main>
  );
}
