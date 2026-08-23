import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Contact JobConnect SA",
  description: "Contact the JobConnect SA team about job listings, corrections, and privacy questions.",
};

export default function ContactPage() {
  return <ContentPage eyebrow="Contact" title="Let&apos;s keep the marketplace useful" intro="Have a question, correction, or concern? Send us the details and our team will review it." sections={[
    { title: "General enquiries", children: <p>Email <a className="font-semibold text-blue-700 hover:underline" href="mailto:contact@jobconnectsa.co.za">contact@jobconnectsa.co.za</a>. Include the relevant page URL so we can respond quickly.</p> },
    { title: "Applicants and job reports", children: <p>For suspicious vacancies, use our <a className="font-semibold text-blue-700 hover:underline" href="/report-job">Report a Job</a> form. Application status questions should be directed to the employer using the application link on the job page.</p> },
    { title: "Privacy requests", children: <p>Use the same email address for questions about information associated with your account or a report. We will verify requests before making changes.</p> },
  ]} />;
}
