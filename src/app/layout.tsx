import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "JobConnect SA | Find jobs in South Africa",
  description:
    "Search verified job opportunities across South Africa and connect with employers through JobConnect SA.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="shrink-0 text-base font-bold text-gray-900 sm:text-lg">
                  Job ConnectSA
                </Link>
                <details className="relative md:hidden">
                  <summary className="cursor-pointer list-none rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                    Menu
                  </summary>
                  <div className="absolute right-0 top-full z-10 mt-2 grid w-56 gap-1 rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-600 shadow-lg">
                    <Link href="/jobs" className="rounded px-3 py-2 hover:bg-gray-50 hover:text-blue-600">
                      Find jobs
                    </Link>
                    <Link href="/about" className="rounded px-3 py-2 hover:bg-gray-50 hover:text-blue-600">
                      About
                    </Link>
                    <Link href="/contact" className="rounded px-3 py-2 hover:bg-gray-50 hover:text-blue-600">
                      Contact
                    </Link>
                    <Link href="/scam-radar" className="rounded px-3 py-2 hover:bg-gray-50 hover:text-blue-600">
                      Scam Radar
                    </Link>
                  </div>
                </details>
              </div>
              <div className="hidden items-center justify-end gap-4 pt-1 text-sm text-gray-600 md:flex lg:gap-5">
                <Link href="/jobs" className="hover:text-blue-600">
                  Find jobs
                </Link>
                <Link href="/about" className="hover:text-blue-600">
                  About
                </Link>
                <Link href="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
                <Link href="/scam-radar" className="hover:text-blue-600">
                  Scam Radar
                </Link>
              </div>
            </nav>
          </header>
          {children}
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-12">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <FooterSection title="Jobs" links={[
                  ["Find Jobs", "/jobs"],
                  ["Latest Jobs", "/jobs"],
                  ["Verified Jobs", "/jobs?verified=true"],
                  ["Government Jobs", "/jobs?category=Government"],
                  ["Internships", "/jobs?jobType=INTERNSHIP"],
                  ["Learnerships", "/jobs?category=Learnerships"],
                  ["Bursaries", "/bursaries"],
                ]} />
                <FooterSection title="Career" links={[
                  ["CV Builder", "/career/cv-builder"],
                  ["Cover Letter", "/career/cover-letter"],
                  ["Interview Preparation", "/career/interview-preparation"],
                  ["Salary Guide", "/career/salary-guide"],
                ]} />
                <FooterSection title="Safety" links={[
                  ["Check a Job", "/verify-job"],
                  ["Scam Radar", "/scam-radar"],
                  ["How We Verify", "/about#verification"],
                  ["Report a Job", "/report-job"],
                ]} />
                <FooterSection title="Company" links={[
                  ["About", "/about"],
                  ["Contact", "/contact"],
                  ["Advertise", "/advertise"],
                  ["Terms", "/terms"],
                  ["Privacy", "/privacy"],
                ]} />
              </div>
              <div className="mt-10 border-t border-gray-100 pt-6 text-sm text-gray-500">
                <p>JobConnect SA helps people find work across South Africa.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-gray-600">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-blue-600 hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
