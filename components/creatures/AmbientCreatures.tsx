import type { ZoneId } from "@/lib/data/types";
import { CreatureSlot } from "./CreatureSlot";

interface AmbientCreaturesProps {
  zoneId: ZoneId;
}

// Deterministic layout (no Math.random) so server and client markup match.
const LAYOUT = [
  { left: "8%", top: "18%", size: 46, duration: 9, delay: 0, opacity: 0.25 },
  { left: "82%", top: "12%", size: 30, duration: 7, delay: 1.2, opacity: 0.2 },
  { left: "70%", top: "62%", size: 58, duration: 11, delay: 0.6, opacity: 0.18 },
  { left: "18%", top: "72%", size: 34, duration: 8, delay: 2, opacity: 0.22 },
  { left: "45%", top: "40%", size: 24, duration: 6.5, delay: 0.9, opacity: 0.15 },
  { left: "92%", top: "80%", size: 40, duration: 10, delay: 1.6, opacity: 0.2 },
];

/**
 * Slow-drifting decorative background elements, pure texture, never
 * interactive. Swap art by adding /assets/creatures/ambient-{zoneId}-{n}.svg
 * (n = 1, 2, 3 across the layout slots; see CreatureSlot and the README in
 * public/assets/creatures).
 */
export function AmbientCreatures({ zoneId }: AmbientCreaturesProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {LAYOUT.map((spot, i) => (
        <div
          key={i}
          className="absolute animate-drift-float text-white"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.size,
            height: spot.size * 0.6,
            opacity: spot.opacity,
            animationDuration: `${spot.duration}s`,
            animationDelay: `${spot.delay}s`,
          }}
        >
          <CreatureSlot
            asset={`ambient-${zoneId}-${(i % 3) + 1}`}
            alt=""
            className="h-full w-full"
            fallback={
              <svg viewBox="0 0 100 60" className="h-full w-full">
                <ellipse
                  cx="50"
                  cy="30"
                  rx="46"
                  ry="16"
                  fill="currentColor"
                />
              </svg>
            }
          />
        </div>
      ))}
    </div>
  );
}
