import { ZoneFormStep } from "./ZoneFormStep";

/** Midnight Zone: skills and hackathon experience. */
export function MidnightZone({ onContinue }: { onContinue: () => void }) {
  return <ZoneFormStep zoneId="midnight" onContinue={onContinue} />;
}
