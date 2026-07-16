import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { AmbientCreatures } from "@/components/creatures/AmbientCreatures";
import { BubbleField } from "@/components/ui/BubbleField";

interface ZoneBackgroundProps {
  currentZone: ZoneId;
}

/**
 * All five zone gradients stacked and cross-faded by opacity — this is what
 * sells "sinking" without ever animating a gradient directly (which CSS
 * can't interpolate smoothly on its own).
 */
export function ZoneBackground({ currentZone }: ZoneBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-hadal-950">
      {ZONES.map((zone) => (
        <div
          key={zone.id}
          className={`absolute inset-0 bg-gradient-to-b ${zone.theme.bg} transition-opacity duration-[600ms] ease-in-out`}
          style={{ opacity: zone.id === currentZone ? 1 : 0 }}
        >
          <AmbientCreatures zoneId={zone.id} />
        </div>
      ))}
      <BubbleField count={16} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
    </div>
  );
}
