import type { ZoneId } from "@/lib/data/types";

export function zoneSectionId(zoneId: ZoneId): string {
  return `zone-${zoneId}`;
}

export function scrollToZone(zoneId: ZoneId) {
  // The id lives on the content block itself (not the taller outer <section>
  // it sits inside), with scroll-mt-* handling the breathing room above it,
  // so "start" lands consistently on the actual content every time.
  document
    .getElementById(zoneSectionId(zoneId))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
