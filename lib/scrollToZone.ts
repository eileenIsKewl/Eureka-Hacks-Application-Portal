import type { ZoneId } from "@/lib/data/types";

export function zoneSectionId(zoneId: ZoneId): string {
  return `zone-${zoneId}`;
}

export function scrollToZone(zoneId: ZoneId) {
  document
    .getElementById(zoneSectionId(zoneId))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
