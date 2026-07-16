import { NextRequest, NextResponse } from "next/server";
import { applicantStore } from "@/lib/data";
import { REVIEW_STATUSES, type ReviewInput } from "@/lib/data/types";

function clampScore(n: unknown): number | null | undefined {
  if (n === null) return null;
  if (typeof n !== "number" || Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(10, n));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid review payload." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const review: ReviewInput = {};

  if (typeof input.status === "string" && REVIEW_STATUSES.includes(input.status as (typeof REVIEW_STATUSES)[number])) {
    review.status = input.status as ReviewInput["status"];
  }
  if ("scoreTechnical" in input) {
    const v = clampScore(input.scoreTechnical);
    if (v !== undefined) review.scoreTechnical = v;
  }
  if ("scoreCreativity" in input) {
    const v = clampScore(input.scoreCreativity);
    if (v !== undefined) review.scoreCreativity = v;
  }
  if ("scoreFit" in input) {
    const v = clampScore(input.scoreFit);
    if (v !== undefined) review.scoreFit = v;
  }
  if (typeof input.reviewerNotes === "string") {
    review.reviewerNotes = input.reviewerNotes.slice(0, 4000);
  }

  const updated = await applicantStore.updateReview(id, review);
  if (!updated) {
    return NextResponse.json({ error: "No trace of that applicant down here." }, { status: 404 });
  }
  return NextResponse.json(updated);
}
