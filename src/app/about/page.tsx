import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "About JobConnect SA",
  description: "Learn how JobConnect SA helps people find work and make safer decisions.",
};

export default function AboutPage() {
  return <ContentPage eyebrow="About us" title="A clearer way to find your next opportunity" intro="JobConnect SA brings South African jobs, career tools, and practical safety guidance together in one place." sections={[
    { title: "Built for the way people search", children: <><p>Finding work can be time-consuming, especially when useful opportunities are scattered across different websites. We organise job information so you can search by role, location, category, and experience level.</p><p>Our goal is straightforward: help people discover relevant opportunities, understand what they are applying for, and make informed decisions before sharing personal information.</p></> },
    { title: "How we verify listings", children: <><p id="verification">We review concerns submitted by the public, check the available listing and company information, and investigate suspicious requests. Automated checks can highlight patterns such as payment demands or unusual contact methods, but they are not proof of fraud.</p><p>Only an administrator can publish a report to Scam Radar after investigation. A listing shown there is an alert based on our review, not a substitute for your own checks or official advice.</p></> },
    { title: "A useful, responsible marketplace", children: <><p>JobConnect SA is not the employer for jobs listed on the platform and does not make hiring decisions. Applications may take place on an employer&apos;s external website, where that organisation&apos;s own terms and privacy policy apply.</p><p>We welcome accurate corrections and reports that help make the job-search experience safer for everyone.</p></> },
  ]} />;
}
