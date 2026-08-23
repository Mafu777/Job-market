import type { Metadata } from "next";
import CareerTool from "@/components/CareerTool";

export const metadata: Metadata = {
  title: "Cover Letter Generator | JobConnect SA",
  description: "Create a tailored cover letter for your next application.",
};

export default function CoverLetterPage() {
  return <CareerTool tool="cover-letter" />;
}
