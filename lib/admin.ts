import type { ApplicantRecord, ReviewStatus } from "@/lib/data/types";
import { getZone } from "@/lib/zones";

export const STATUS_META: Record<
  ReviewStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-white/10 text-white/70 border-white/15",
    dotClass: "bg-white/50",
  },
  ACCEPTED: {
    label: "Accepted",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dotClass: "bg-rose-400",
  },
  WAITLISTED: {
    label: "Waitlisted",
    badgeClass: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    dotClass: "bg-amber-300",
  },
};

export function averageScore(a: ApplicantRecord): number | null {
  const scores = [a.scoreTechnical, a.scoreCreativity, a.scoreFit].filter(
    (s): s is number => typeof s === "number"
  );
  if (scores.length === 0) return null;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

export function displayName(a: ApplicantRecord): string {
  return a.fullName?.trim() || a.email?.trim() || "Unnamed applicant";
}

export function zoneReachedLabel(a: ApplicantRecord): string {
  if (a.submitted) return "Submitted";
  return getZone(a.currentZone).name;
}

export type SortKey = "createdAt" | "name" | "score" | "school" | "completion";
export type SortDir = "asc" | "desc";

export function sortApplicants(
  list: ApplicantRecord[],
  key: SortKey,
  dir: SortDir
): ApplicantRecord[] {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name":
        cmp = displayName(a).localeCompare(displayName(b));
        break;
      case "score": {
        const av = averageScore(a) ?? -1;
        const bv = averageScore(b) ?? -1;
        cmp = av - bv;
        break;
      }
      case "school":
        cmp = (a.school ?? "").localeCompare(b.school ?? "");
        break;
      case "completion": {
        const aIdx = a.submitted ? 5 : getZone(a.currentZone).order;
        const bIdx = b.submitted ? 5 : getZone(b.currentZone).order;
        cmp = aIdx - bIdx;
        break;
      }
      case "createdAt":
      default:
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function matchesSearch(a: ApplicantRecord, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    (a.fullName ?? "").toLowerCase().includes(q) ||
    (a.email ?? "").toLowerCase().includes(q)
  );
}
