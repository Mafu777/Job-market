import type { Metadata } from "next";
import JobReportForm from "@/components/JobReportForm";

export const metadata: Metadata = {
  title: "Check a Job | JobConnect SA",
  description: "Submit a job link for scam screening and investigation.",
};

export default function VerifyJobPage() {
  return <JobReportForm title="Check a job" description="Have a job link but want to check it first? Send it to us for screening. We will investigate suspicious details and follow up using your preferred contact method." />;
}
