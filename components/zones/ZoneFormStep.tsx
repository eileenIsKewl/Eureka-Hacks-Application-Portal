"use client";

import { useState } from "react";
import { getZone } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { FormField } from "@/components/ui/FormField";
import { useApplication } from "@/hooks/useApplication";
import { ZoneStepShell } from "./ZoneStepShell";

interface ZoneFormStepProps {
  zoneId: ZoneId;
}

/**
 * Generic, config-driven step used by the Sunlight, Twilight, Midnight, and
 * Abyssal zones — the actual field list for each comes from lib/zones.ts, so
 * this component never needs to know about individual questions.
 */
export function ZoneFormStep({ zoneId }: ZoneFormStepProps) {
  const zone = getZone(zoneId);
  const { values, errors, touched, setField, touchField, isZoneValid, touchZone, goNext } =
    useApplication();
  const [attempted, setAttempted] = useState(false);

  const valid = isZoneValid(zoneId);

  function handleNext() {
    if (!valid) {
      touchZone(zoneId);
      setAttempted(true);
      return;
    }
    goNext();
  }

  return (
    <ZoneStepShell zoneId={zoneId} onNext={handleNext} showJustCompleted={attempted && valid}>
      <div className="flex flex-col gap-6">
        {zone.fields.map((field) => (
          <FormField
            key={field.name}
            config={field}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            touched={touched[field.name] || attempted}
            onChange={(v) => setField(field.name, v)}
            onBlur={() => touchField(field.name)}
          />
        ))}
      </div>
    </ZoneStepShell>
  );
}
