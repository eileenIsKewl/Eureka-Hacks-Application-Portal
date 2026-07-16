import type { ApplicantRecord } from "@/lib/data/types";
import { averageScore } from "@/lib/admin";
import { Card } from "@/components/ui/Card";

interface StatsBarProps {
  applicants: ApplicantRecord[];
}

export function StatsBar({ applicants }: StatsBarProps) {
  const total = applicants.length;
  const reviewed = applicants.filter((a) => a.status !== "PENDING").length;
  const remaining = total - reviewed;
  const scored = applicants
    .map(averageScore)
    .filter((s): s is number => typeof s === "number");
  const avg =
    scored.length > 0
      ? (scored.reduce((sum, s) => sum + s, 0) / scored.length).toFixed(1)
      : "—";

  const stats = [
    { label: "Total applicants", value: total },
    { label: "Reviewed", value: reviewed },
    { label: "Left to review", value: remaining },
    { label: "Average score", value: avg },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-4">
          <p className="text-2xl font-semibold text-glow-400">{s.value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-white/45">
            {s.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
