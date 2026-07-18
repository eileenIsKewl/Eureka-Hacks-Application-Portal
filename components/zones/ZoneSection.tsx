"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getZone, zonesRemaining } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { zoneSectionId } from "@/lib/scrollToZone";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReactionMascot } from "@/components/creatures/ReactionMascot";
import { AmbientCreatures } from "@/components/creatures/AmbientCreatures";
import { BubbleField } from "@/components/ui/BubbleField";
import { useApplication } from "@/hooks/useApplication";

interface ZoneSectionProps {
  zoneId: ZoneId;
  children: React.ReactNode;
  onContinue: () => void;
  nextLabel?: string;
  headerExtra?: React.ReactNode;
}

const SAVE_LABEL: Record<string, string> = {
  idle: "",
  saving: "Autosaving…",
  saved: "Saved to the depths",
  error: "Couldn't reach the surface, but it's still saved on this device",
};

/**
 * One full-height panel of the scrolling descent. Each zone owns its own
 * background and decorations (instead of a shared fixed overlay), so the
 * color change simply happens as the page physically scrolls past the
 * boundary between two sections.
 */
export function ZoneSection({ zoneId, children, onContinue, nextLabel, headerExtra }: ZoneSectionProps) {
  const zone = getZone(zoneId);
  const { saveStatus, isZoneValid, touchZone } = useApplication();
  const [attempted, setAttempted] = useState(false);
  const remaining = zonesRemaining(zoneId);

  function handleContinue() {
    if (!isZoneValid(zoneId)) {
      touchZone(zoneId);
      setAttempted(true);
      return;
    }
    onContinue();
  }

  return (
    <section
      id={zoneSectionId(zoneId)}
      className={`relative flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-b ${zone.theme.bg} px-6 py-20 pl-8 sm:pl-12`}
    >
      <div className="pointer-events-none absolute inset-0">
        <AmbientCreatures zoneId={zoneId} />
        <BubbleField count={14} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-2xl"
      >
        <div className="mb-1 flex items-center gap-3">
          <h1 className={`font-display text-3xl ${zone.theme.text} sm:text-4xl`}>
            {zone.name}
          </h1>
          <ReactionMascot zoneId={zoneId} show={attempted && isZoneValid(zoneId)} />
        </div>
        <p className="mb-4 text-xs uppercase tracking-wide text-white/40">
          {zone.depthLabel}
          {remaining > 0 &&
            ` · ${remaining} zone${remaining === 1 ? "" : "s"} left to sink through`}
        </p>
        <p className="mb-8 max-w-lg text-white/70">{zone.description}</p>

        {headerExtra}

        <Card className={zone.theme.glow}>{children}</Card>

        <div className="mt-6 flex items-center justify-end gap-4">
          <span className="hidden text-xs text-white/40 sm:inline">
            {SAVE_LABEL[saveStatus]}
          </span>
          <Button variant="primary" onClick={handleContinue} type="button">
            {nextLabel ?? zone.ctaLabel}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
