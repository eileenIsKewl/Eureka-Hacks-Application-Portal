import type { ZoneId } from "@/lib/data/types";

export function zoneSectionId(zoneId: ZoneId): string {
  return `zone-${zoneId}`;
}

export function scrollToZone(zoneId: ZoneId) {
  // Sections are taller than the viewport with their content centered, so
  // centering the section (rather than snapping to its top) is what
  // actually lands on the visible content instead of blank space above it.
  document
    .getElementById(zoneSectionId(zoneId))
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
