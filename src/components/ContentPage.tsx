import Link from "next/link";

export type ContentSection = { title: string; children: React.ReactNode };

export default function ContentPage({ eyebrow, title, intro, sections, aside }: { eyebrow: string; title: string; intro: string; sections: ContentSection[]; aside?: React.ReactNode }) {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{intro}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="max-w-3xl space-y-10">
          {sections.map((section) => <section key={section.title}><h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2><div className="mt-4 space-y-4 text-base leading-8 text-slate-600">{section.children}</div></section>)}
        </article>
        {aside ?? <aside className="h-fit rounded-xl border border-blue-100 bg-blue-50 p-6"><h2 className="font-semibold text-slate-950">Questions?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Our team is here to help.</p><Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">Contact JobConnect SA</Link></aside>}
      </div>
    </main>
  );
}
