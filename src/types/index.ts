export type Role = "JOB_SEEKER" | "EMPLOYER" | "ADMIN";

export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY";

export type ExperienceLevel =
  | "ENTRY"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "EXECUTIVE";

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "OFFERED"
  | "REJECTED"
  | "WITHDRAWN";

export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "EXPIRED";

export interface JobCardData {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string | null;
  location: string;
  remote: boolean;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number | null;
  salaryMax?: number | null;
  category: string;
  imageUrl?: string | null;
  featured: boolean;
  publishedAt?: string | null;
}

export interface JobFilters {
  query?: string;
  location?: string;
  category?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  remote?: boolean;
  page?: number;
}
