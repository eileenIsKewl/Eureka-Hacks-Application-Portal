import { ZoneFormStep } from "./ZoneFormStep";

/** Twilight Zone: education and background. */
export function TwilightZone({ onContinue }: { onContinue: () => void }) {
  return <ZoneFormStep zoneId="twilight" onContinue={onContinue} />;
}
