export const ZONE_IDS = [
  "sunlight",
  "twilight",
  "midnight",
  "abyssal",
  "hadal",
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

export const REVIEW_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** The applicant record as seen by clients. Resume bytes are never sent, only metadata. */
export interface ApplicantRecord {
  id: string;
  currentZone: ZoneId;
  submitted: boolean;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Sunlight
  fullName: string | null;
  email: string | null;
  pronouns: string | null;
  phone: string | null;

  // Twilight
  school: string | null;
  educationLevel: string | null;
  gradYear: string | null;
  fieldOfStudy: string | null;

  // Midnight
  hackathonsAttended: string | null;
  technicalSkills: string | null;
  portfolioUrl: string | null;
  dietaryRestrictions: string | null;

  // Abyssal
  essayWhy: string | null;
  essayLearn: string | null;
  essayProject: string | null;

  // Hadal
  resumeFileName: string | null;
  resumeMimeType: string | null;
  hasResume: boolean;

  // Review
  status: ReviewStatus;
  scoreTechnical: number | null;
  scoreCreativity: number | null;
  scoreFit: number | null;
  reviewerNotes: string | null;
  reviewedAt: string | null;
}

/** Fields the applicant can write to about themselves. Excludes lifecycle/review fields. */
export type ApplicantFieldInput = Partial<
  Pick<
    ApplicantRecord,
    | "fullName"
    | "email"
    | "pronouns"
    | "phone"
    | "school"
    | "educationLevel"
    | "gradYear"
    | "fieldOfStudy"
    | "hackathonsAttended"
    | "technicalSkills"
    | "portfolioUrl"
    | "dietaryRestrictions"
    | "essayWhy"
    | "essayLearn"
    | "essayProject"
    | "currentZone"
  >
>;

export interface ReviewInput {
  status?: ReviewStatus;
  scoreTechnical?: number | null;
  scoreCreativity?: number | null;
  scoreFit?: number | null;
  reviewerNotes?: string | null;
}
