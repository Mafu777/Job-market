import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jobs?query=&location=&category=&jobType=&experienceLevel=&remote=&page=
export async function GET(req: Request) {
const { searchParams } = new URL(req.url);

const query = searchParams.get("query") ?? undefined;
const location = searchParams.get("location") ?? undefined;
const category = searchParams.get("category") ?? undefined;
const jobType = searchParams.get("jobType") ?? undefined;
const experienceLevel = searchParams.get("experienceLevel") ?? undefined;
const remote = searchParams.get("remote");
const verified = searchParams.get("verified");
const page = parseInt(searchParams.get("page") ?? "1", 10);
const pageSize = 20;

const jobs = await prisma.job.findMany({
where: {
status: "PUBLISHED",
...(verified === "true" && { company: { verified: true } }),
...(query && {
OR: [
{ title: { contains: query, mode: "insensitive" } },
{ description: { contains: query, mode: "insensitive" } },
],
}),
...(location && { location: { contains: location, mode: "insensitive" } }),
...(category && { category }),
...(jobType && { jobType: jobType as never }),
...(experienceLevel && { experienceLevel: experienceLevel as never }),
...(remote === "true" && { remote: true }),
},
include: { company: true },
orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
skip: (page - 1) * pageSize,
take: pageSize,
});

return NextResponse.json({ jobs, page, pageSize });
}

// Job creation now happens exclusively through /api/admin/jobs