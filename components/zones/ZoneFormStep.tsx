"use client";

import { getZone } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { FormField } from "@/components/ui/FormField";
import { useApplication } from "@/hooks/useApplication";
import { ZoneSection } from "./ZoneSection";

interface ZoneFormStepProps {
  zoneId: ZoneId;
  onContinue: () => void;
}

/**
 * Generic, config-driven section used by the Twilight, Midnight, and
 * Abyssal zones. The actual field list for each comes from lib/zones.ts, so
 * this component never needs to know about individual questions.
 */
export function ZoneFormStep({ zoneId, onContinue }: ZoneFormStepProps) {
  const zone = getZone(zoneId);
  const { values, errors, touched, setField, touchField } = useApplication();

  return (
    <ZoneSection zoneId={zoneId} onContinue={onContinue}>
      <div className="flex flex-col gap-6">
        {zone.fields.map((field) => (
          <FormField
            key={field.name}
            config={field}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            touched={touched[field.name]}
            onChange={(v) => setField(field.name, v)}
            onBlur={() => touchField(field.name)}
          />
        ))}
      </div>
    </ZoneSection>
  );
}
