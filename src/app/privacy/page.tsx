import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | JobConnect SA",
  description: "The JobConnect SA privacy policy explains how information is collected and used.",
};

export default function PrivacyPage() {
  return <ContentPage eyebrow="Privacy" title="How we handle your information" intro="We collect only what we need to operate a useful, secure job marketplace and respond to people who contact us." sections={[
    { title: "Information we collect", children: <p>We may collect account details, profile details you choose to provide, job and company information, report contact details, and technical information such as browser, device, and access logs.</p> },
    { title: "How we use information", children: <p>We use information to operate the marketplace, authenticate accounts, publish listings, investigate reports, respond to enquiries, prevent abuse, and improve the service. We do not sell your personal information.</p> },
    { title: "Cookies and advertising", children: <p>We may use cookies for authentication, preferences, security, measurement, and advertising. If Google AdSense is enabled, Google and its partners may use cookies to serve or measure ads. You can manage personalised advertising through <a className="font-semibold text-blue-700 hover:underline" href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google Ads Settings</a>.</p> },
    { title: "Your choices and external sites", children: <><p>You can contact us to ask about, correct, or remove information associated with your account, subject to legal requirements. Email contact@jobconnectsa.co.za.</p><p>Employer application websites have their own privacy policies and practices.</p></> },
  ]} />;
}
