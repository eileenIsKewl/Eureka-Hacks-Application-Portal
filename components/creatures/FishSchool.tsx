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
  distant: boolean;
}

// The sepia-then-hue-rotate trick washes the art toward blue, which with
// the blur and lowered contrast reads as "seen through a lot of water."
// Fish stay fully opaque (translucency looked wrong wherever two fish
// crossed paths); distance is sold entirely by this filter instead.
const DISTANT_FILTER =
  "blur(1.5px) sepia(0.45) hue-rotate(160deg) saturate(0.65) brightness(0.85)";

// Deterministic spread (no Math.random) so server and client render the
// same swarm. Copy count adapts to the zone's roster size, so zones with
// only a couple of species (like Twilight) still get a full school; each
// copy has its own lane, size, speed, and direction. Roughly a third of
// the school swims in a distant layer: smaller, slower, blue-washed.
function instancesFor(files: string[]): FishInstance[] {
  const out: FishInstance[] = [];
  const copiesPerFish = Math.max(4, Math.round(20 / files.length));
  files.forEach((file, fi) => {
    for (let c = 0; c < copiesPerFish; c++) {
      const seed = fi * 7 + c * 13 + 3;
      const distant = seed % 3 === 0;
      const width = 80 + ((seed * 29) % 160);
      const duration = 18 + ((seed * 11) % 34);
      out.push({
        file,
        top: `${4 + ((seed * 17) % 86)}%`,
        width: distant ? Math.round(width * 0.55) : width,
        duration: distant ? Math.round(duration * 1.6) : duration,
        delay: -((seed * 5) % 45),
        bobDuration: 3 + (seed % 5),
        direction: seed % 2 === 0 ? "left" : "right",
        distant,
      });
    }
  });
  // Distant fish paint first so near fish always pass in front of them.
  return out.sort((a, b) => Number(b.distant) - Number(a.distant));
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
    // Deliberately unclipped: fish near a zone edge swim across the
    // boundary and overlap the neighboring section instead of losing
    // their tails to it. (Horizontal overflow is caught by the body's
    // overflow-x: hidden.)
    <div aria-hidden className="pointer-events-none absolute inset-0">
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
                filter: fish.distant ? DISTANT_FILTER : undefined,
                transform: fish.direction === "right" ? "scaleX(-1)" : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
