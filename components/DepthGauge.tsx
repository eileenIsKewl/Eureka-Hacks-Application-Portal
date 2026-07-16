"use client";

import { motion } from "framer-motion";
import { ZONES, zonesRemaining } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { ZoneMascot } from "@/components/creatures/ZoneMascot";
import { cn } from "@/lib/cn";

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

/**
 * A descent meter, not a plain progress bar: tick marks for each zone,
 * a glowing fill that sinks as you advance, a live depth readout, and the
 * current zone's companion creature riding the leading edge.
 */
export function DepthGauge({ currentZone }: DepthGaugeProps) {
  const currentIndex = ZONES.findIndex((z) => z.id === currentZone);
  const fillPercent = (currentIndex / (ZONES.length - 1)) * 100;
  const remaining = zonesRemaining(currentZone);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
        <span>Depth gauge</span>
        <span className="font-mono text-glow-400">
          {currentDepthReadout[currentZone]}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sunlight-500 via-glow-500 to-glow-600 shadow-glow-teal"
          initial={false}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {ZONES.map((zone, i) => {
          const pos = (i / (ZONES.length - 1)) * 100;
          const reached = i <= currentIndex;
          return (
            <div
              key={zone.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${pos}%` }}
            >
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 transition-colors duration-300",
                  reached
                    ? "border-glow-400 bg-glow-500"
                    : "border-white/25 bg-hadal-900"
                )}
                title={zone.name}
              />
            </div>
          );
        })}

        <motion.div
          className="absolute top-1/2"
          initial={false}
          animate={{ left: `${fillPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ translateX: "-50%", translateY: "-70%" }}
        >
          <ZoneMascot zoneId={currentZone} active size={40} />
        </motion.div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-display text-sm text-white/80">
          {ZONES[currentIndex].name}
        </span>
        <span className="text-xs text-white/45">
          {remaining === 0
            ? "The bottom of the trench"
            : `${remaining} zone${remaining === 1 ? "" : "s"} left to sink through`}
        </span>
      </div>
    </div>
  );
}
