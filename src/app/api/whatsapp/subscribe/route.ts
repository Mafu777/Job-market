import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizePhone(value: unknown) {
  if (typeof value !== "string") return null;
  const phone = value.replace(/[\s()-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = normalizePhone(body.phone);
  const optedIn = body.optedIn !== false;

  if (!phone) {
    return NextResponse.json({ error: "Enter a valid international number, for example +27821234567." }, { status: 400 });
  }
  if (!optedIn) {
    await prisma.whatsAppSubscriber.updateMany({ where: { phone }, data: { optedIn: false } });
    return NextResponse.json({ message: "You have been unsubscribed." });
  }

  await prisma.whatsAppSubscriber.upsert({
    where: { phone },
    update: { optedIn: true },
    create: { phone, optedIn: true },
  });
  return NextResponse.json({ message: "You are subscribed to new job alerts." }, { status: 201 });
}