import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Terms of Use | JobConnect SA",
  description: "The terms that apply when using the JobConnect SA job marketplace.",
};

export default function TermsPage() {
  return <ContentPage eyebrow="Terms" title="Simple rules for a trustworthy marketplace" intro="These terms explain how JobConnect SA can be used and what to expect from listings, applications, and our service." sections={[
    { title: "Using JobConnect SA", children: <p>Use the service lawfully and respectfully. Do not attempt unauthorised access, submit fraudulent or misleading content, or misuse the platform in a way that harms other people or the service.</p> },
    { title: "Listings and applications", children: <p>Listings may be supplied by employers or administrators. We do not guarantee availability, accuracy, or suitability, and we do not make hiring decisions. External application websites have their own terms and privacy policies.</p> },
    { title: "Changes and availability", children: <p>We may update, remove, or temporarily suspend parts of the service. We may also update these terms, with the latest version published on this page.</p> },
    { title: "Contact", children: <p>Questions about these terms can be sent to contact@jobconnectsa.co.za.</p> },
  ]} />;
}
