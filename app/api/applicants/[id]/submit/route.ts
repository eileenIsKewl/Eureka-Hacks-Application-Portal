import { NextRequest, NextResponse } from "next/server";
import { applicantStore } from "@/lib/data";
import { ZONES } from "@/lib/zones";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const applicant = await applicantStore.get(id);
  if (!applicant) {
    return NextResponse.json({ error: "No trace of that applicant down here." }, { status: 404 });
  }

  const missing: string[] = [];
  for (const zone of ZONES) {
    for (const field of zone.fields) {
      const value = (applicant as unknown as Record<string, unknown>)[field.name];
      const error = field.validate
        ? field.validate(typeof value === "string" ? value : "")
        : field.required && !value
        ? "required"
        : null;
      if (error) missing.push(field.label);
    }
  }
  if (!applicant.hasResume) missing.push("Resume");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: "The dive isn't complete yet. A few things still need answers before you can send it down.",
        missing,
      },
      { status: 400 }
    );
  }

  const updated = await applicantStore.submit(id);
  return NextResponse.json(updated);
}
