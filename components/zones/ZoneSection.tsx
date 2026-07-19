"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getZone, zonesRemaining } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { zoneSectionId } from "@/lib/scrollToZone";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReactionMascot } from "@/components/creatures/ReactionMascot";
import { BubbleField } from "@/components/ui/BubbleField";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { FishSchool } from "@/components/creatures/FishSchool";
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
 * One full-height panel of the scrolling descent. The background is one
 * continuous gradient shared across every section (see DescentBackground);
 * each section only contributes its own decorations and content on top.
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
    <section className="relative flex min-h-[150vh] w-full items-center overflow-hidden px-6 py-32">
      <ParallaxLayer className="pointer-events-none absolute inset-0">
        <BubbleField count={14} />
      </ParallaxLayer>
      <FishSchool zoneId={zoneId} />

      <motion.div
        id={zoneSectionId(zoneId)}
        initial={{ opacity: 0, y: 70, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-2xl scroll-mt-20"
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
