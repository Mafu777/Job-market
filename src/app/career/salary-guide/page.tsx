import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Guide | JobConnect SA",
  description: "Explore indicative South African salary ranges with sources and update dates.",
};

const salaryRanges = [
  { role: "Data analyst", experience: "Entry to junior", range: "R15,000-R30,000/month", source: "Indicative benchmark; validate against current South African salary surveys", updated: "23 August 2026" },
  { role: "Software developer", experience: "Junior", range: "R20,000-R40,000/month", source: "Indicative benchmark; validate against current South African salary surveys", updated: "23 August 2026" },
  { role: "Administrative assistant", experience: "Entry to junior", range: "R8,000-R16,000/month", source: "Indicative benchmark; validate against current South African salary surveys", updated: "23 August 2026" },
  { role: "Customer service agent", experience: "Entry to junior", range: "R8,000-R18,000/month", source: "Indicative benchmark; validate against current South African salary surveys", updated: "23 August 2026" },
  { role: "Registered nurse", experience: "Qualified", range: "R20,000-R40,000/month", source: "Indicative benchmark; validate against current South African salary surveys", updated: "23 August 2026" },
];

export default function SalaryGuidePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">South African salary guide</h1>
      <p className="mt-3 max-w-3xl text-gray-600">Use these indicative ranges as a starting point for research. Pay varies by city, industry, qualifications, experience, and employer. AI does not generate the figures shown here.</p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700"><tr><th className="px-5 py-4 font-semibold">Role</th><th className="px-5 py-4 font-semibold">Experience</th><th className="px-5 py-4 font-semibold">Indicative range</th><th className="px-5 py-4 font-semibold">Source and date</th></tr></thead>
          <tbody>{salaryRanges.map((item) => <tr key={item.role} className="border-b border-gray-100 last:border-0"><td className="px-5 py-4 font-medium text-gray-900">{item.role}</td><td className="px-5 py-4 text-gray-600">{item.experience}</td><td className="px-5 py-4 text-gray-900">{item.range}</td><td className="px-5 py-4 text-gray-600">{item.source}<br /><span className="text-xs text-gray-500">Updated {item.updated}</span></td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-5 text-sm text-gray-500">These figures are planning estimates, not guarantees or professional financial advice. We will expand this guide with documented survey links and anonymous user-submitted data.</p>
    </main>
  );
}
