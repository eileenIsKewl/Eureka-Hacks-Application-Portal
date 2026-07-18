"use client";

import { useEffect, useState } from "react";
import { ZONES } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { zoneSectionId } from "@/lib/scrollToZone";

/**
 * Tracks whichever zone section is most in view, so the depth gauge and
 * ambient tinting can follow actual scroll position instead of whatever
 * button was last clicked.
 */
export function useVisibleZone(): ZoneId {
  const [visibleZoneId, setVisibleZoneId] = useState<ZoneId>("sunlight");

  useEffect(() => {
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace("zone-", "");
          ratios[id] = entry.intersectionRatio;
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(ratios)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setVisibleZoneId(best as ZoneId);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    const elements = ZONES.map((z) => document.getElementById(zoneSectionId(z.id))).filter(
      (el): el is HTMLElement => !!el
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleZoneId;
}
