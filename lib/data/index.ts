import { PrismaApplicantStore } from "./prisma-store";
import type { ApplicantStore } from "./store";

/**
 * Single entry point the rest of the app imports. To swap persistence layers
 * (e.g. Postgres in production), implement `ApplicantStore` and change this
 * one line — every API route and page is written against the interface only.
 */
export const applicantStore: ApplicantStore = new PrismaApplicantStore();

export type { ApplicantStore } from "./store";
export * from "./types";
