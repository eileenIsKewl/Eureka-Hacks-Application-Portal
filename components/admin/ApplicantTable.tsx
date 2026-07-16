"use client";

import { useRouter } from "next/navigation";
import type { ApplicantRecord } from "@/lib/data/types";
import { averageScore, displayName, zoneReachedLabel } from "@/lib/admin";
import { StatusBadge } from "./StatusBadge";

interface ApplicantTableProps {
  applicants: ApplicantRecord[];
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  const router = useRouter();

  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-white/40">
        Empty water. No applicants match — try wider nets.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
            <th className="px-4 py-3 font-medium">Applicant</th>
            <th className="px-4 py-3 font-medium">School</th>
            <th className="px-4 py-3 font-medium">Zone reached</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => {
            const score = averageScore(a);
            return (
              <tr
                key={a.id}
                onClick={() => router.push(`/admin/${a.id}`)}
                className="cursor-pointer border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{displayName(a)}</div>
                  <div className="text-xs text-white/40">{a.email ?? "no email"}</div>
                </td>
                <td className="px-4 py-3 text-white/70">{a.school ?? "—"}</td>
                <td className="px-4 py-3 text-white/70">{zoneReachedLabel(a)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3 text-glow-400">
                  {score !== null ? score.toFixed(1) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
