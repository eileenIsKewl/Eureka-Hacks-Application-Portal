"use client";

import { useRouter } from "next/navigation";
import type { ApplicantRecord } from "@/lib/data/types";
import { averageScore, displayName, zoneReachedLabel } from "@/lib/admin";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/Card";

interface ApplicantCardsProps {
  applicants: ApplicantRecord[];
}

export function ApplicantCards({ applicants }: ApplicantCardsProps) {
  const router = useRouter();

  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
        Empty water. No applicants match — try wider nets.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applicants.map((a) => {
        const score = averageScore(a);
        return (
          <Card
            key={a.id}
            onClick={() => router.push(`/admin/${a.id}`)}
            className="cursor-pointer transition-colors hover:border-glow-500/40"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{displayName(a)}</p>
                <p className="text-xs text-white/40">{a.email ?? "no email"}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{a.school ?? "No school listed"}</span>
              <span className="text-glow-400">
                {score !== null ? score.toFixed(1) : "unscored"}
              </span>
            </div>
            <div className="mt-3 text-xs text-white/40">
              {zoneReachedLabel(a)}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
