"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REVIEW_STATUSES, type ApplicantRecord, type ReviewStatus } from "@/lib/data/types";
import { STATUS_META, averageScore, displayName } from "@/lib/admin";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface KanbanBoardProps {
  applicants: ApplicantRecord[];
  onStatusChange: (id: string, status: ReviewStatus) => void;
}

/**
 * The status pipeline: drag an applicant card between columns to change
 * their review status, submarine-dashboard style.
 */
export function KanbanBoard({ applicants, onStatusChange }: KanbanBoardProps) {
  const router = useRouter();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<ReviewStatus | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {REVIEW_STATUSES.map((status) => {
        const columnApplicants = applicants.filter((a) => a.status === status);
        const meta = STATUS_META[status];
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setOverColumn(status);
            }}
            onDragLeave={() => setOverColumn((c) => (c === status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingId) onStatusChange(draggingId, status);
              setDraggingId(null);
              setOverColumn(null);
            }}
            className={cn(
              "flex min-h-[16rem] flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-colors",
              overColumn === status && "border-glow-500/60 bg-glow-500/5"
            )}
          >
            <div className="flex items-center justify-between px-1">
              <span className={cn("text-sm font-medium", meta.textClass)}>
                {meta.label}
              </span>
              <span className="text-xs text-white/40">{columnApplicants.length}</span>
            </div>

            {columnApplicants.length === 0 && (
              <p className="px-1 text-xs text-white/30">Nothing drifted in here yet.</p>
            )}

            {columnApplicants.map((a) => {
              const score = averageScore(a);
              return (
                <Card
                  key={a.id}
                  draggable
                  onDragStart={() => setDraggingId(a.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onClick={() => router.push(`/admin/${a.id}`)}
                  className={cn(
                    "cursor-grab p-3 active:cursor-grabbing",
                    draggingId === a.id && "opacity-40"
                  )}
                >
                  <p className="text-sm font-medium text-white">{displayName(a)}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/40">
                    <span>{a.school ?? "No school"}</span>
                    <span className="text-glow-400">
                      {score !== null ? score.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
