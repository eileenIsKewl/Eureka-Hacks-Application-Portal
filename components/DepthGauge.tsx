"use client";

import { motion } from "framer-motion";
import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";

interface DepthGaugeProps {
  currentZone: ZoneId;
}

// Visual weight of each zone's band on the rail. Not to scale with real
// meters (the trench would swallow everything else), just enough to read as
// "the deeper zones take up more of the descent."
const BAND_WEIGHT: Record<ZoneId, number> = {
  sunlight: 8,
  twilight: 14,
  midnight: 24,
  abyssal: 20,
  hadal: 34,
};

const BAND_COLOR: Record<ZoneId, string> = {
  sunlight: "bg-sunlight-400",
  twilight: "bg-twilight-500",
  midnight: "bg-midnight-600",
  abyssal: "bg-abyssal-600",
  hadal: "bg-hadal-800",
};

const totalWeight = ZONES.reduce((sum, z) => sum + BAND_WEIGHT[z.id], 0);

function cumulativeTop(zoneId: ZoneId): number {
  let top = 0;
  for (const zone of ZONES) {
    if (zone.id === zoneId) break;
    top += BAND_WEIGHT[zone.id];
  }
  return (top / totalWeight) * 100;
}

/**
 * The descent meter: a slim vertical rail along the edge of the screen, not
 * a plain progress bar. Each zone gets a color band matching its theme, so
 * you can see the whole water column above and below you at a glance.
 * Deliberately narrow so it never competes with the actual form content;
 * the zone name, depth, and mascot live in the main content area instead.
 */
export function DepthGauge({ currentZone }: DepthGaugeProps) {
  const markerTop = cumulativeTop(currentZone) + (BAND_WEIGHT[currentZone] / totalWeight) * 50;

  return (
    <div
      className="fixed left-0 top-0 z-20 h-dvh w-2.5 shrink-0 sm:w-3"
      role="img"
      aria-label={`Currently in the ${currentZone} zone`}
    >
      <div className="relative h-full w-full overflow-hidden">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`w-full ${BAND_COLOR[zone.id]} border-t border-black/20 first:border-t-0`}
            style={{ height: `${(BAND_WEIGHT[zone.id] / totalWeight) * 100}%` }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-glow-400 shadow-glow-teal ring-2 ring-hadal-950"
          initial={false}
          animate={{ top: `${markerTop}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ translateY: "-50%" }}
        />
      </div>
    </div>
  );
}
