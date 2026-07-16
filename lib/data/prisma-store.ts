import type { Applicant } from "@prisma/client";
import { prisma } from "./prisma";
import type { ApplicantStore } from "./store";
import type {
  ApplicantFieldInput,
  ApplicantRecord,
  ReviewInput,
  ReviewStatus,
  ZoneId,
} from "./types";

function serialize(a: Applicant): ApplicantRecord {
  return {
    id: a.id,
    currentZone: a.currentZone as ZoneId,
    submitted: a.submitted,
    submittedAt: a.submittedAt ? a.submittedAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),

    fullName: a.fullName,
    email: a.email,
    pronouns: a.pronouns,
    phone: a.phone,

    school: a.school,
    educationLevel: a.educationLevel,
    gradYear: a.gradYear,
    fieldOfStudy: a.fieldOfStudy,

    hackathonsAttended: a.hackathonsAttended,
    technicalSkills: a.technicalSkills,
    portfolioUrl: a.portfolioUrl,
    dietaryRestrictions: a.dietaryRestrictions,

    essayWhy: a.essayWhy,
    essayLearn: a.essayLearn,
    essayProject: a.essayProject,

    resumeFileName: a.resumeFileName,
    resumeMimeType: a.resumeMimeType,
    hasResume: !!a.resumeData,

    status: a.status as ReviewStatus,
    scoreTechnical: a.scoreTechnical,
    scoreCreativity: a.scoreCreativity,
    scoreFit: a.scoreFit,
    reviewerNotes: a.reviewerNotes,
    reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
  };
}

export class PrismaApplicantStore implements ApplicantStore {
  async create(): Promise<ApplicantRecord> {
    const a = await prisma.applicant.create({ data: {} });
    return serialize(a);
  }

  async get(id: string): Promise<ApplicantRecord | null> {
    const a = await prisma.applicant.findUnique({ where: { id } });
    return a ? serialize(a) : null;
  }

  async list(): Promise<ApplicantRecord[]> {
    const rows = await prisma.applicant.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(serialize);
  }

  async updateFields(
    id: string,
    fields: ApplicantFieldInput
  ): Promise<ApplicantRecord | null> {
    try {
      const a = await prisma.applicant.update({
        where: { id },
        data: fields,
      });
      return serialize(a);
    } catch {
      return null;
    }
  }

  async submit(id: string): Promise<ApplicantRecord | null> {
    try {
      const a = await prisma.applicant.update({
        where: { id },
        data: { submitted: true, submittedAt: new Date(), currentZone: "hadal" },
      });
      return serialize(a);
    } catch {
      return null;
    }
  }

  async updateReview(
    id: string,
    review: ReviewInput
  ): Promise<ApplicantRecord | null> {
    try {
      const a = await prisma.applicant.update({
        where: { id },
        data: { ...review, reviewedAt: new Date() },
      });
      return serialize(a);
    } catch {
      return null;
    }
  }

  async saveResume(
    id: string,
    file: { name: string; type: string; data: Buffer }
  ): Promise<ApplicantRecord | null> {
    try {
      const a = await prisma.applicant.update({
        where: { id },
        data: {
          resumeFileName: file.name,
          resumeMimeType: file.type,
          resumeData: file.data,
        },
      });
      return serialize(a);
    } catch {
      return null;
    }
  }

  async getResumeBytes(
    id: string
  ): Promise<{ name: string; type: string; data: Buffer } | null> {
    const a = await prisma.applicant.findUnique({ where: { id } });
    if (!a || !a.resumeData) return null;
    return {
      name: a.resumeFileName ?? "resume",
      type: a.resumeMimeType ?? "application/octet-stream",
      data: Buffer.from(a.resumeData),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.applicant.delete({ where: { id } }).catch(() => undefined);
  }
}
