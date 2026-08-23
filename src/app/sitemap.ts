import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/jobs",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/jobs" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const jobs = await prisma.job.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, updatedAt: true },
    });

    return [
      ...staticPages,
      ...jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: job.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticPages;
  }
}
