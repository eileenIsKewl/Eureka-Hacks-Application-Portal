import Link from "next/link";
import { getZone } from "@/lib/zones";
import { AmbientCreatures } from "@/components/creatures/AmbientCreatures";
import { BubbleField } from "@/components/ui/BubbleField";
import { ZoneMascot } from "@/components/creatures/ZoneMascot";
import { Button } from "@/components/ui/Button";

const zone = getZone("sunlight");

export default function Home() {
  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${zone.theme.bg} px-6 text-center`}
    >
      <div className="pointer-events-none absolute inset-0">
        <AmbientCreatures zoneId="sunlight" />
        <BubbleField count={10} />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <div className="mb-6">
          <ZoneMascot zoneId="sunlight" size={64} />
        </div>
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-sunlight-900/70">
          EurekaHacks
        </p>
        <h1 className="mb-5 font-display text-4xl text-sunlight-950 sm:text-6xl">
          How far down will you go?
        </h1>
        <p className="mb-10 max-w-md text-balance text-sunlight-950/80">
          The application to EurekaHacks isn&apos;t a form, it&apos;s a
          descent. Five ocean zones, each one darker and deeper than the
          last. Bring a light.
        </p>
        <Link href="/apply">
          <Button variant="primary" className="px-8 py-4 text-base">
            Begin the descent
          </Button>
        </Link>

        <Link
          href="/admin"
          className="mt-10 text-xs text-sunlight-950/50 underline decoration-dotted underline-offset-4 hover:text-sunlight-950/80"
        >
          Reviewer control room →
        </Link>
      </div>
    </div>
  );
}
