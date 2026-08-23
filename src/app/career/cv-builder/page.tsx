import type { Metadata } from "next";
import CareerTool from "@/components/CareerTool";

export const metadata: Metadata = {
  title: "CV Builder | JobConnect SA",
  description: "Build a focused CV for South African job opportunities.",
};

export default function CvBuilderPage() {
  return <CareerTool tool="cv" />;
}
