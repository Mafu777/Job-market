import Link from "next/link";
import WhatsAppAlerts from "@/components/WhatsAppAlerts";

const popularCategories = [
  { label: "Matric Jobs", href: "/jobs?query=matric" },
  { label: "No Experience", href: "/jobs?query=no%20experience" },
  { label: "Internships", href: "/jobs?jobType=INTERNSHIP" },
  { label: "Learnerships", href: "/jobs?category=Learnerships" },
  { label: "Graduate Jobs", href: "/jobs?query=graduate" },
  { label: "Apprenticeships", href: "/jobs?query=apprentice" },
  { label: "Driver Jobs", href: "/jobs?query=driver" },
  { label: "Government Jobs", href: "/jobs?category=Government" },
  { label: "Work From Home", href: "/jobs?remote=true" },
  { label: "Verified Jobs", href: "/jobs?verified=true" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="relative isolate overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 -z-10 bg-gray-900/70" />

        <div className="mx-auto max-w-5xl px-6 py-32 text-center sm:py-40">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find a job.
            <br />
            Check it first.
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            South African jobs, internships and opportunities with verification to help you
            avoid fake vacancies.
          </p>

          <form
            action="/jobs"
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="job-query" className="sr-only">
              What job are you looking for?
            </label>
            <input
              id="job-query"
              type="text"
              name="query"
              placeholder="Job title, keyword or company"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            />
            <label htmlFor="job-location" className="sr-only">
              Where?
            </label>
            <input
              id="job-location"
              type="text"
              name="location"
              placeholder="City or province"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search Jobs
            </button>
          </form>

          <Link
            href="/verify-job"
            className="mt-5 inline-flex items-center rounded-lg border border-white/60 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
          >
            Have you already found a job? Check it here →
          </Link>

          <section className="mt-16 text-left">
            <h2 className="text-xl font-semibold text-white">Popular right now</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {popularCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="rounded-lg border border-white/20 bg-white/95 px-4 py-4 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  {category.label}
                  <span className="mt-2 block text-xs font-normal text-blue-700">View jobs</span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </section>
      <WhatsAppAlerts />
    </main>
  );
}
