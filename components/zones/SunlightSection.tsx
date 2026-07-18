"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getZone, zonesRemaining } from "@/lib/zones";
import { zoneSectionId } from "@/lib/scrollToZone";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { BubbleField } from "@/components/ui/BubbleField";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { SubmarinePicker } from "@/components/SubmarinePicker";
import { useApplication } from "@/hooks/useApplication";

const zone = getZone("sunlight");

interface SunlightSectionProps {
  onContinue: () => void;
}

/**
 * The welcome hero: a frosted-glass form card on one side, the submarine
 * picker (on its own little dock) on the other. Bespoke rather than the
 * generic ZoneSection template because this is the first thing anyone sees.
 */
export function SunlightSection({ onContinue }: SunlightSectionProps) {
  const { values, errors, touched, setField, touchField, isZoneValid, touchZone } =
    useApplication();
  const [attempted, setAttempted] = useState(false);
  const remaining = zonesRemaining("sunlight");

  function handleContinue() {
    if (!isZoneValid("sunlight")) {
      touchZone("sunlight");
      setAttempted(true);
      return;
    }
    onContinue();
  }

  return (
    <section
      id={zoneSectionId("sunlight")}
      className="relative flex min-h-screen w-full items-center overflow-hidden px-6 py-16"
    >
      <ParallaxLayer className="pointer-events-none absolute inset-0">
        <BubbleField count={10} />
      </ParallaxLayer>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-sunlight-950/60">
          EurekaHacks · {zone.depthLabel}
        </p>
        <h1 className="mb-8 font-display text-3xl text-sunlight-950 sm:text-5xl">
          How far down will you go?
        </h1>

        <div className="grid items-stretch gap-10 lg:grid-cols-2">
          {/* Glass form card */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/50 bg-white/25 p-8 shadow-[0_20px_50px_-20px_rgba(11,42,58,0.4)] backdrop-blur-xl">
            <h2 className="mb-1 font-display text-2xl text-sunlight-950">Welcome!</h2>
            <p className="mb-6 text-sm text-sunlight-950/70">{zone.description}</p>

            <div className="flex flex-col gap-5">
              {zone.fields.map((field) => (
                <FormField
                  key={field.name}
                  config={field}
                  value={values[field.name] ?? ""}
                  error={errors[field.name]}
                  touched={touched[field.name] || attempted}
                  onChange={(v) => setField(field.name, v)}
                  onBlur={() => touchField(field.name)}
                  tone="light"
                />
              ))}
            </div>
          </div>

          {/* Submarine dock: negative margin pulls it past the container edge, closer to the screen edge */}
          <div className="flex items-center justify-center lg:-mr-32 lg:justify-end xl:-mr-50">
            <SubmarinePicker />
          </div>
        </div>

        <p className="mt-6 text-xs text-sunlight-950/50">
          {remaining} zone{remaining === 1 ? "" : "s"} left to sink through after this one
        </p>

        <div className="mt-4 flex justify-center lg:justify-start">
          <Button
            variant="primary"
            onClick={handleContinue}
            className="px-10 py-4 text-lg"
          >
            {zone.ctaLabel}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
