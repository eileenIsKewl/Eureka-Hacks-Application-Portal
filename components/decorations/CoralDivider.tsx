import { cn } from "@/lib/cn";

interface CoralDividerProps {
  /** The zone's order (0-3). Even orders sit on the right edge, odd on the left. */
  order: number;
}

/**
 * A coral outcrop straddling the boundary between two zones, hugging one
 * screen edge. Alternates sides as you descend, mirrors the art on the
 * left so both sides read naturally, and dims with depth so coral in the
 * darker zones looks like it's actually down there.
 */
export function CoralDivider({ order }: CoralDividerProps) {
  const side = order % 2 === 0 ? "right" : "left";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 z-5 translate-y-1/2",
        side === "right" ? "-right-8 sm:-right-4" : "-left-8 sm:-left-4"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative art */}
      <img
        src="/assets/decorations/CoralChunk.png"
        alt=""
        draggable={false}
        className={cn("w-56 sm:w-80 lg:w-96", side === "right" && "-scale-x-100")}
        style={{ filter: `brightness(${1 - order * 0.16})` }}
      />
    </div>
  );
}
