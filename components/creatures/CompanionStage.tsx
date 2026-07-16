import { getZone } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { ZoneMascot } from "@/components/creatures/ZoneMascot";
import { cn } from "@/lib/cn";

interface CompanionStageProps {
  zoneId: ZoneId;
}

/**
 * Dedicated real estate for the zone's companion creature, big enough to
 * actually show off hand-drawn art once it exists. Alternates sides zone to
 * zone (order-first vs order-last in the flex row below) so the layout
 * doesn't feel like the same static template five times in a row.
 */
export function CompanionStage({ zoneId }: CompanionStageProps) {
  const zone = getZone(zoneId);
  const onLeft = zone.order % 2 === 1;

  return (
    <div
      className={cn(
        "hidden w-40 shrink-0 items-center justify-center lg:flex",
        onLeft ? "order-first" : "order-last"
      )}
    >
      <div className="h-36 w-36 opacity-90">
        <ZoneMascot zoneId={zoneId} active size={144} />
      </div>
    </div>
  );
}
