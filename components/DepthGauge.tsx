"use client";

import { motion } from "framer-motion";
import { ZONES, zonesRemaining } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { ZoneMascot } from "@/components/creatures/ZoneMascot";

interface DepthGaugeProps {
  currentZone: ZoneId;
}

const currentDepthReadout: Record<ZoneId, string> = {
  sunlight: "0m",
  twilight: "200m",
  midnight: "1,000m",
  abyssal: "4,000m",
  hadal: "6,000m+",
};

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
 * The descent meter: a vertical rail along the side of the screen, not a
 * plain progress bar. Each zone gets a color band matching its theme, so you
 * can see the whole water column above and below you at a glance. Sticky
 * positioned so it never scrolls out of view while you fill in a zone.
 */
export function DepthGauge({ currentZone }: DepthGaugeProps) {
  const remaining = zonesRemaining(currentZone);
  const markerTop = cumulativeTop(currentZone) + BAND_WEIGHT[currentZone] / totalWeight * 50;

  return (
    <div className="sticky top-0 flex h-dvh w-16 shrink-0 flex-col border-r border-white/10 bg-black/25 backdrop-blur-sm sm:w-20 md:w-56">
      <div className="hidden shrink-0 flex-col gap-1 px-4 py-5 md:flex">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          Depth gauge
        </span>
        <span className="font-mono text-sm text-glow-400">
          {currentDepthReadout[currentZone]}
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            className={`relative w-full ${BAND_COLOR[zone.id]} border-t border-black/20 first:border-t-0`}
            style={{ height: `${(BAND_WEIGHT[zone.id] / totalWeight) * 100}%` }}
          >
            <span className="absolute left-2 top-1.5 hidden text-[10px] font-medium uppercase tracking-wide text-white/70 md:block">
              {zone.name.replace(" Zone", "")}
            </span>
          </div>
        ))}

        <motion.div
          className="absolute left-0 flex w-full items-center gap-2 px-2"
          initial={false}
          animate={{ top: `${markerTop}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ translateY: "-50%" }}
        >
          <div className="h-3 w-3 shrink-0 rounded-full bg-glow-400 shadow-glow-teal ring-2 ring-hadal-950" />
          <div className="hidden sm:block">
            <ZoneMascot zoneId={currentZone} active size={36} />
          </div>
        </motion.div>
      </div>

      <div className="hidden shrink-0 border-t border-white/10 px-4 py-4 md:block">
        <p className="font-display text-sm text-white/85">
          {ZONES.find((z) => z.id === currentZone)?.name}
        </p>
        <p className="mt-1 text-xs text-white/45">
          {remaining === 0
            ? "The bottom of the trench"
            : `${remaining} zone${remaining === 1 ? "" : "s"} left to sink through`}
        </p>
      </div>
    </div>
  );
}
