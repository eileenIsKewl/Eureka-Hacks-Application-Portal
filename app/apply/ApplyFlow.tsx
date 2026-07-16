"use client";

import { AnimatePresence } from "framer-motion";
import { ApplicationProvider, useApplication } from "@/hooks/useApplication";
import { ZoneBackground } from "@/components/zones/ZoneBackground";
import { SunlightZone } from "@/components/zones/SunlightZone";
import { TwilightZone } from "@/components/zones/TwilightZone";
import { MidnightZone } from "@/components/zones/MidnightZone";
import { AbyssalZone } from "@/components/zones/AbyssalZone";
import { HadalZone } from "@/components/zones/HadalZone";
import { ConfirmationScreen } from "@/components/zones/ConfirmationScreen";

function ApplyContent() {
  const { loading, currentZoneId, submitted, applicantId } = useApplication();

  if (loading) {
    return (
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center text-white/60">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-glow-500 border-t-transparent" />
          <p className="text-sm">Finding your place in the water column…</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return <ConfirmationScreen applicantId={applicantId} />;
  }

  return (
    <AnimatePresence mode="wait">
      {currentZoneId === "sunlight" && <SunlightZone key="sunlight" />}
      {currentZoneId === "twilight" && <TwilightZone key="twilight" />}
      {currentZoneId === "midnight" && <MidnightZone key="midnight" />}
      {currentZoneId === "abyssal" && <AbyssalZone key="abyssal" />}
      {currentZoneId === "hadal" && (
        <HadalZone key="hadal" onSubmitted={() => undefined} />
      )}
    </AnimatePresence>
  );
}

function ApplyBackground() {
  const { currentZoneId, submitted } = useApplication();
  return <ZoneBackground currentZone={submitted ? "hadal" : currentZoneId} />;
}

export function ApplyFlow() {
  return (
    <ApplicationProvider>
      <ApplyBackground />
      <ApplyContent />
    </ApplicationProvider>
  );
}
