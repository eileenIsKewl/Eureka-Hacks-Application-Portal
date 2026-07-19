import type { ZoneId } from "@/lib/data/types";

/**
 * Which fish live in which zone. Paths are relative to /assets/creatures
 * (PNG assumed). To add fish to a zone, drop the art in the matching folder
 * and list it here; everything else (copies, speeds, directions, positions)
 * is generated automatically.
 */
const FISH_BY_ZONE: Record<ZoneId, string[]> = {
  sunlight: [
    "sunlight_zone/ClownFish",
    "sunlight_zone/HornFish",
    "sunlight_zone/MiniFish",
    "sunlight_zone/PatternFish",
    "sunlight_zone/StripesFish",
  ],
  twilight: ["twilight_zone/PufferFish", "twilight_zone/Seahorse"],
  midnight: [],
  abyssal: [],
  hadal: [],
};

interface FishInstance {
  file: string;
  top: string;
  width: number;
  duration: number;
  delay: number;
  bobDuration: number;
  direction: "left" | "right";
  opacity: number;
}

// Deterministic spread (no Math.random) so server and client render the
// same swarm. Copy count adapts to the zone's roster size, so zones with
// only a couple of species (like Twilight) still get a full school; each
// copy has its own lane, size, speed, and direction.
function instancesFor(files: string[]): FishInstance[] {
  const out: FishInstance[] = [];
  const copiesPerFish = Math.max(4, Math.round(20 / files.length));
  files.forEach((file, fi) => {
    for (let c = 0; c < copiesPerFish; c++) {
      const seed = fi * 7 + c * 13 + 3;
      out.push({
        file,
        top: `${4 + ((seed * 17) % 86)}%`,
        width: 80 + ((seed * 29) % 160),
        duration: 18 + ((seed * 11) % 34),
        delay: -((seed * 5) % 45),
        bobDuration: 3 + (seed % 5),
        direction: seed % 2 === 0 ? "left" : "right",
        opacity: 0.7 + ((seed % 4) * 0.1),
      });
    }
  });
  return out;
}

/**
 * The zone's fish, swimming across the section behind the content. All art
 * faces left natively; right-swimmers are mirrored with scaleX(-1).
 */
export function FishSchool({ zoneId }: { zoneId: ZoneId }) {
  const files = FISH_BY_ZONE[zoneId];
  if (files.length === 0) return null;

  const school = instancesFor(files);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {school.map((fish, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: fish.top,
            animation: `${fish.direction === "left" ? "swim-left" : "swim-right"} ${fish.duration}s linear infinite`,
            animationDelay: `${fish.delay}s`,
          }}
        >
          <div style={{ animation: `fish-bob ${fish.bobDuration}s ease-in-out infinite` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative art, sized tiny; next/image adds nothing here */}
            <img
              src={`/assets/creatures/${fish.file}.png`}
              alt=""
              draggable={false}
              style={{
                width: fish.width,
                opacity: fish.opacity,
                transform: fish.direction === "right" ? "scaleX(-1)" : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
