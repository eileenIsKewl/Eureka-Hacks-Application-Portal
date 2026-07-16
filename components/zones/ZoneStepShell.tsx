"use client";

import { motion } from "framer-motion";
import { getZone } from "@/lib/zones";
import type { ZoneId } from "@/lib/data/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReactionMascot } from "@/components/creatures/ReactionMascot";
import { useApplication } from "@/hooks/useApplication";

interface ZoneStepShellProps {
  zoneId: ZoneId;
  children: React.ReactNode;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showJustCompleted?: boolean;
}

const SAVE_LABEL: Record<string, string> = {
  idle: "",
  saving: "Autosaving…",
  saved: "Saved to the depths",
  error: "Couldn't reach the surface, but it's still saved on this device",
};

export function ZoneStepShell({
  zoneId,
  children,
  onNext,
  nextDisabled,
  nextLabel,
  showJustCompleted,
}: ZoneStepShellProps) {
  const zone = getZone(zoneId);
  const { saveStatus, goBack } = useApplication();
  const isFirst = zone.order === 0;

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-16">
      <motion.div
        key={zoneId}
        initial={{ opacity: 0, y: 36, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="mb-6 flex items-center gap-3">
          <h1 className={`font-display text-3xl ${zone.theme.text} sm:text-4xl`}>
            {zone.name}
          </h1>
          <ReactionMascot zoneId={zoneId} show={!!showJustCompleted} />
        </div>
        <p className="mb-8 max-w-lg text-white/70">{zone.description}</p>

        <Card className={zone.theme.glow}>{children}</Card>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {!isFirst && (
              <Button variant="ghost" onClick={goBack} type="button">
                ← Back up
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-white/40 sm:inline">
              {SAVE_LABEL[saveStatus]}
            </span>
            <Button
              variant="primary"
              onClick={onNext}
              disabled={nextDisabled}
              type="button"
            >
              {nextLabel ?? zone.ctaLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
