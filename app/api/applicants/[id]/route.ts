import { NextRequest, NextResponse } from "next/server";
import { applicantStore } from "@/lib/data";
import { ZONE_IDS, type ApplicantFieldInput } from "@/lib/data/types";

const EDITABLE_FIELDS = [
  "fullName",
  "email",
  "pronouns",
  "phone",
  "school",
  "educationLevel",
  "gradYear",
  "fieldOfStudy",
  "hackathonsAttended",
  "technicalSkills",
  "portfolioUrl",
  "dietaryRestrictions",
  "essayWhy",
  "essayLearn",
  "essayProject",
] as const;

function sanitizeFieldInput(body: unknown): ApplicantFieldInput {
  if (!body || typeof body !== "object") return {};
  const input = body as Record<string, unknown>;
  const clean: ApplicantFieldInput = {};

  for (const key of EDITABLE_FIELDS) {
    const raw = input[key];
    if (typeof raw === "string") {
      (clean as Record<string, string>)[key] = raw.slice(0, 4000);
    }
  }

  if (typeof input.currentZone === "string" && ZONE_IDS.includes(input.currentZone as (typeof ZONE_IDS)[number])) {
    clean.currentZone = input.currentZone as ApplicantFieldInput["currentZone"];
  }

  return clean;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const applicant = await applicantStore.get(id);
  if (!applicant) {
    return NextResponse.json({ error: "No trace of that applicant down here." }, { status: 404 });
  }
  return NextResponse.json(applicant);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const fields = sanitizeFieldInput(body);

  const updated = await applicantStore.updateFields(id, fields);
  if (!updated) {
    return NextResponse.json({ error: "No trace of that applicant down here." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await applicantStore.delete(id);
  return NextResponse.json({ ok: true });
}
