import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { ZoneAnswerSection } from "./ZoneAnswerSection";

interface ReviewSummaryProps {
  values: Record<string, string | null | undefined>;
  onEditZone: (zoneId: ZoneId) => void;
}

/**
 * The trench looking-glass: every answer laid out as if the applicant is
 * staring back up through the entire water column at the surface they
 * started from.
 */
export function ReviewSummary({ values, onEditZone }: ReviewSummaryProps) {
  const reviewableZones = ZONES.filter((z) => z.fields.length > 0);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sunlight-400/10 blur-3xl"
      />
      <p className="relative mb-6 text-center text-sm text-white/50">
        Look back up. This is everything you're bringing down with you.
      </p>
      <div className="relative flex flex-col gap-5">
        {reviewableZones.map((zone) => (
          <ZoneAnswerSection
            key={zone.id}
            zoneId={zone.id}
            values={values}
            onEdit={() => onEditZone(zone.id)}
          />
        ))}
      </div>
    </div>
  );
}
