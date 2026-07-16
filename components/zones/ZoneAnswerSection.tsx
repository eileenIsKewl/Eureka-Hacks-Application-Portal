import { getZone, formatFieldValue } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ZoneMascot } from "@/components/creatures/ZoneMascot";

interface ZoneAnswerSectionProps {
  zoneId: ZoneId;
  values: Record<string, string | null | undefined>;
  onEdit?: () => void;
}

/**
 * Read-only Q&A block for one zone, shared by the applicant-facing review
 * screen and the admin detail view, so both read as "the same product."
 */
export function ZoneAnswerSection({ zoneId, values, onEdit }: ZoneAnswerSectionProps) {
  const zone = getZone(zoneId);

  return (
    <Card className="border-white/10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ZoneMascot zoneId={zoneId} size={32} />
          <h3 className={`font-display text-lg ${zone.theme.accent}`}>{zone.name}</h3>
        </div>
        {onEdit && (
          <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        {zone.fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "sm:col-span-2" : undefined}
          >
            <dt className="text-xs uppercase tracking-wide text-white/40">
              {field.label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-white/90">
              {formatFieldValue(field, values[field.name])}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
