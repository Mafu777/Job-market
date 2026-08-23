import type { Metadata } from "next";
import JobReportForm from "@/components/JobReportForm";

export const metadata: Metadata = {
  title: "Report a Job | JobConnect SA",
  description: "Tell JobConnect SA about a job you believe may be a scam.",
};

export default function ReportJobPage() {
  return <JobReportForm title="Report a job" description="Tell us about a job you believe is a scam or contains suspicious requests. Include as much evidence as you can so our team can investigate it." />;
}