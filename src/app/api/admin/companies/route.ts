import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error role added via callbacks
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/companies — list all companies (for the dropdown)
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companies = await prisma.company.findMany({
    select: { id: true, name: true, location: true, verified: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ companies });
}

// POST /api/admin/companies — create a new company shell (no linked user)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, location, industry, website, logoUrl } = body;

  if (!name) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  // Admin-created companies need a placeholder user to satisfy the schema's
  // required one-to-one relation between User and Company.
  const placeholderEmail = `admin-created-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@placeholder.local`;

  const company = await prisma.company.create({
    data: {
      name,
      location,
      industry,
      website,
      logoUrl,
      verified: true,
      user: {
        create: {
          email: placeholderEmail,
          role: "EMPLOYER",
        },
      },
    },
  });

  return NextResponse.json(company, { status: 201 });
}
