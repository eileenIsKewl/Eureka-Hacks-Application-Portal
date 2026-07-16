"use client";

import { useEffect, useRef, useState } from "react";
import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { AmbientCreatures } from "@/components/creatures/AmbientCreatures";
import { BubbleField } from "@/components/ui/BubbleField";

interface ZoneBackgroundProps {
  currentZone: ZoneId;
}

// More bubbles and a heavier vignette the deeper you go, so the water column
// itself feels like it's closing in around you.
const BUBBLE_COUNT: Record<ZoneId, number> = {
  sunlight: 10,
  twilight: 16,
  midnight: 22,
  abyssal: 28,
  hadal: 34,
};

const VIGNETTE_OPACITY: Record<ZoneId, string> = {
  sunlight: "to-black/10",
  twilight: "to-black/25",
  midnight: "to-black/40",
  abyssal: "to-black/55",
  hadal: "to-black/70",
};

/**
 * All five zone gradients stacked and cross-faded by opacity. This is what
 * sells "sinking" without ever animating a gradient directly (which CSS
 * can't interpolate smoothly on its own). A brief darkening pulse fires on
 * every zone change to sell the drop.
 */
export function ZoneBackground({ currentZone }: ZoneBackgroundProps) {
  const [pulsing, setPulsing] = useState(false);
  const prevZone = useRef(currentZone);

  useEffect(() => {
    if (prevZone.current === currentZone) return;
    prevZone.current = currentZone;
    setPulsing(true);
    const timer = setTimeout(() => setPulsing(false), 500);
    return () => clearTimeout(timer);
  }, [currentZone]);

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
      <BubbleField count={BUBBLE_COUNT[currentZone]} />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 ${VIGNETTE_OPACITY[currentZone]} transition-[background] duration-[600ms] ease-in-out`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ease-in"
        style={{ opacity: pulsing ? 0.25 : 0 }}
      />
    </div>
  );
}
