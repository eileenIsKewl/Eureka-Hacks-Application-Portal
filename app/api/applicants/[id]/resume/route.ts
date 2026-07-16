import { NextRequest, NextResponse } from "next/server";
import { applicantStore } from "@/lib/data";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const form = await req.formData().catch(() => null);
  const file = form?.get("resume");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file made it into the current." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That file is too heavy to sink with you. Keep it under 5MB." },
      { status: 400 }
    );
  }
  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF or Word documents can make this dive." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const updated = await applicantStore.saveResume(id, {
    name: file.name,
    type: file.type || "application/octet-stream",
    data: buffer,
  });

  if (!updated) {
    return NextResponse.json({ error: "No trace of that applicant down here." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resume = await applicantStore.getResumeBytes(id);
  if (!resume) {
    return NextResponse.json({ error: "No resume has been left down here." }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(resume.data), {
    headers: {
      "Content-Type": resume.type,
      "Content-Disposition": `attachment; filename="${resume.name}"`,
    },
  });
}
