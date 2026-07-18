import { ZoneFormStep } from "./ZoneFormStep";

/** Abyssal Zone: essay questions and motivation. */
export function AbyssalZone({ onContinue }: { onContinue: () => void }) {
  return <ZoneFormStep zoneId="abyssal" onContinue={onContinue} />;
}
