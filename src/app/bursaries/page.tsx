import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bursaries | JobConnect SA",
  description: "Discover bursary opportunities and learn how to apply safely in South Africa.",
};

const guidance = [
  { title: "Start with the official source", text: "Apply through the funder, university, government department, or employer website. Use JobConnect SA as a starting point, then confirm the opportunity at its official source." },
  { title: "Check the requirements", text: "Review closing dates, citizenship or residency requirements, academic results, study fields, and supporting documents before applying." },
  { title: "Never pay to apply", text: "A genuine bursary should not require a processing fee, gift card, cryptocurrency payment, or payment to secure selection." },
];

export default function BursariesPage() {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Plan your next step</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Bursaries that help you move forward</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Find funding opportunities, understand what funders look for, and apply with confidence. We are building a carefully organised bursary directory for South African students.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {guidance.map((item, index) => <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p></article>)}
        </div>
        <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Bursary directory coming soon</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-700">We are preparing a directory with funder, field of study, location, eligibility, closing date, and official application links. We will publish opportunities only when their source and deadline can be clearly identified.</p>
          <Link href="/contact?subject=bursary" className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Tell us what you need</Link>
        </div>
      </section>
    </main>
  );
}
