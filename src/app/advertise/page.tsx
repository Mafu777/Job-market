import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise with JobConnect SA",
  description: "Reach South African job seekers with responsible recruitment advertising.",
};

export default function AdvertisePage() {
  return (
    <main className="bg-slate-50">
      <section className="bg-slate-900 text-white"><div className="mx-auto max-w-6xl px-6 py-16"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">For employers and partners</p><h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Put your opportunity in front of the right people</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Talk to us about job listings, employer visibility, and partnerships that respect applicants and keep opportunity information clear.</p></div></section>
      <section className="mx-auto max-w-6xl px-6 py-14"><div className="grid gap-6 md:grid-cols-3">{[["Job listings", "Share well-written vacancies with candidates actively looking for their next role."], ["Employer visibility", "Build a clear presence with accurate company information and relevant opportunities."], ["Partnerships", "Explore responsible collaborations with training providers, institutions, and career services."]].map(([title, text]) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div><div className="mt-12 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-semibold text-slate-950">Start a conversation</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Send your organisation name, the opportunity you want to promote, your target audience, and your preferred timeline. We review promotional requests for accuracy and applicant safety.</p><Link href="/contact?subject=advertising" className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">Contact our team</Link></div></section>
    </main>
  );
}
