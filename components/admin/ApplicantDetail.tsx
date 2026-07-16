"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReviewStatus } from "@/lib/data/types";
import { ZONES } from "@/lib/zones";
import { displayName } from "@/lib/admin";
import { useApplicants } from "@/hooks/useApplicants";
import { ZoneAnswerSection } from "@/components/zones/ZoneAnswerSection";
import { StatusBadge } from "./StatusBadge";
import { ScorePanel } from "./ScorePanel";
import { NotesField } from "./NotesField";
import { Button } from "@/components/ui/Button";

interface ApplicantDetailProps {
  id: string;
}

const reviewableZones = ZONES.filter((z) => z.fields.length > 0);

export function ApplicantDetail({ id }: ApplicantDetailProps) {
  const router = useRouter();
  const { applicants, loading, updateReview } = useApplicants();
  const applicant = useMemo(
    () => applicants.find((a) => a.id === id) ?? null,
    [applicants, id]
  );
  const notFound = !loading && !applicant;

  const orderedIds = useMemo(
    () =>
      [...applicants]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((a) => a.id),
    [applicants]
  );

  const goToOffset = useCallback(
    (offset: number) => {
      const idx = orderedIds.indexOf(id);
      if (idx === -1) return;
      const nextIdx = idx + offset;
      if (nextIdx >= 0 && nextIdx < orderedIds.length) {
        router.push(`/admin/${orderedIds[nextIdx]}`);
      }
    },
    [orderedIds, id, router]
  );

  const setStatus = useCallback(
    (status: ReviewStatus) => {
      updateReview(id, { status });
    },
    [id, updateReview]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;

      switch (e.key.toLowerCase()) {
        case "a":
          setStatus("ACCEPTED");
          break;
        case "r":
          setStatus("REJECTED");
          break;
        case "w":
          setStatus("WAITLISTED");
          break;
        case "arrowdown":
        case "arrowright":
          e.preventDefault();
          goToOffset(1);
          break;
        case "arrowup":
        case "arrowleft":
          e.preventDefault();
          goToOffset(-1);
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setStatus, goToOffset]);

  if (notFound) {
    return (
      <div className="py-24 text-center text-white/50">
        <p>This applicant drifted somewhere we can&apos;t reach.</p>
        <Link href="/admin" className="mt-4 inline-block text-glow-400 underline">
          Back to the roster
        </Link>
      </div>
    );
  }

  if (loading || !applicant) {
    return <p className="text-white/50">Descending to their file…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs text-white/40 hover:text-white/70">
            ← Roster
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-display text-2xl text-white">{displayName(applicant)}</h1>
            <StatusBadge status={applicant.status} />
          </div>
          <p className="text-sm text-white/40">{applicant.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => goToOffset(-1)}>
            ↑ Prev
          </Button>
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => goToOffset(1)}>
            Next ↓
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="accept" onClick={() => setStatus("ACCEPTED")}>
          Accept (A)
        </Button>
        <Button variant="waitlist" onClick={() => setStatus("WAITLISTED")}>
          Waitlist (W)
        </Button>
        <Button variant="reject" onClick={() => setStatus("REJECTED")}>
          Reject (R)
        </Button>
        {applicant.hasResume && (
          <a
            href={`/api/applicants/${applicant.id}/resume`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <Button variant="ghost">Download resume</Button>
          </a>
        )}
      </div>

      <p className="-mt-3 text-xs text-white/30">
        Keyboard shortcuts <kbd className="text-white/50">A</kbd> accept ·{" "}
        <kbd className="text-white/50">W</kbd> waitlist ·{" "}
        <kbd className="text-white/50">R</kbd> reject ·{" "}
        <kbd className="text-white/50">↑↓</kbd> move between applicants
      </p>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5">
          {reviewableZones.map((zone) => (
            <ZoneAnswerSection
              key={zone.id}
              zoneId={zone.id}
              values={applicant as unknown as Record<string, string | null>}
            />
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <ScorePanel
            scoreTechnical={applicant.scoreTechnical}
            scoreCreativity={applicant.scoreCreativity}
            scoreFit={applicant.scoreFit}
            onChange={(field, value) => updateReview(id, { [field]: value })}
          />
          <NotesField
            key={applicant.id}
            value={applicant.reviewerNotes ?? ""}
            onSave={(notes) => updateReview(id, { reviewerNotes: notes })}
          />
        </div>
      </div>
    </div>
  );
}
