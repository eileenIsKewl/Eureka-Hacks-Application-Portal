"use client";

import type { ZoneId } from "@/lib/data/types";
import { scrollToZone } from "@/lib/scrollToZone";
import { ApplicationProvider, useApplication } from "@/hooks/useApplication";
import { useVisibleZone } from "@/hooks/useVisibleZone";
import { DepthGauge } from "@/components/DepthGauge";
import { SubmarineFollower } from "@/components/SubmarineFollower";
import { SunlightSection } from "@/components/zones/SunlightSection";
import { TwilightZone } from "@/components/zones/TwilightZone";
import { MidnightZone } from "@/components/zones/MidnightZone";
import { AbyssalZone } from "@/components/zones/AbyssalZone";
import { HadalSection } from "@/components/zones/HadalSection";
import { ConfirmationScreen } from "@/components/zones/ConfirmationScreen";

function ApplyContent() {
  const { loading, submitted, applicantId, goToZone } = useApplication();
  const visibleZoneId = useVisibleZone();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-hadal-950 text-white/60">
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

  function continueTo(zoneId: ZoneId) {
    goToZone(zoneId);
    scrollToZone(zoneId);
  }

  return (
    <div className="relative">
      <DepthGauge currentZone={visibleZoneId} />
      <SubmarineFollower />

      <SunlightSection onContinue={() => continueTo("twilight")} />
      <TwilightZone onContinue={() => continueTo("midnight")} />
      <MidnightZone onContinue={() => continueTo("abyssal")} />
      <AbyssalZone onContinue={() => continueTo("hadal")} />
      <HadalSection onSubmitted={() => undefined} />
    </div>
  );
}

export function ApplyFlow() {
  return (
    <ApplicationProvider>
      <ApplyContent />
    </ApplicationProvider>
  );
}
