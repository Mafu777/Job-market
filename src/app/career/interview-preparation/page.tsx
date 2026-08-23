import type { Metadata } from "next";
import CareerTool from "@/components/CareerTool";

export const metadata: Metadata = {
  title: "Interview Preparation | JobConnect SA",
  description: "Prepare for job interviews with focused questions and practical guidance.",
};

export default function InterviewPreparationPage() {
  return <CareerTool tool="interview" />;
}
