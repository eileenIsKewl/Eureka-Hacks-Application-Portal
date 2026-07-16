import { NextResponse } from "next/server";
import { applicantStore } from "@/lib/data";

export async function POST() {
  const applicant = await applicantStore.create();
  return NextResponse.json(applicant, { status: 201 });
}

export async function GET() {
  const applicants = await applicantStore.list();
  return NextResponse.json(applicants);
}
