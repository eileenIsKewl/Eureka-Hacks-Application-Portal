import type { ZoneId } from "@/lib/data/types";
import { DepthGauge } from "@/components/DepthGauge";

interface ApplyShellProps {
  currentZone: ZoneId;
  children: React.ReactNode;
}

/**
 * Shared frame for every zone step: the depth gauge sits fixed on the side
 * (sticky, so it stays put while the zone content scrolls), and the zone
 * content fills the rest of the viewport.
 */
export function ApplyShell({ currentZone, children }: ApplyShellProps) {
  return (
    <div className="relative z-10 flex min-h-screen w-full">
      <DepthGauge currentZone={currentZone} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
