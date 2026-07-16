import type {
  ApplicantFieldInput,
  ApplicantRecord,
  ReviewInput,
} from "./types";

/**
 * Storage-agnostic contract for applicant persistence. Swap the SQLite/Prisma
 * implementation for Postgres (or anything else) by writing a new class that
 * satisfies this interface. Nothing above this layer needs to change.
 */
export interface ApplicantStore {
  create(): Promise<ApplicantRecord>;
  get(id: string): Promise<ApplicantRecord | null>;
  list(): Promise<ApplicantRecord[]>;
  updateFields(
    id: string,
    fields: ApplicantFieldInput
  ): Promise<ApplicantRecord | null>;
  submit(id: string): Promise<ApplicantRecord | null>;
  updateReview(
    id: string,
    review: ReviewInput
  ): Promise<ApplicantRecord | null>;
  saveResume(
    id: string,
    file: { name: string; type: string; data: Buffer }
  ): Promise<ApplicantRecord | null>;
  getResumeBytes(
    id: string
  ): Promise<{ name: string; type: string; data: Buffer } | null>;
  delete(id: string): Promise<void>;
}
