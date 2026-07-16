"use client";

import { useState } from "react";

const EXTENSIONS = ["svg", "png"] as const;

export interface CreatureSlotProps {
  /** Filename (without extension) inside /assets/creatures, e.g. "sunlight-companion" */
  asset: string;
  alt: string;
  className?: string;
  /** Rendered until (or unless) a matching hand-drawn asset exists at /assets/creatures/{asset}.(svg|png) */
  fallback: React.ReactNode;
}

/**
 * The swap point for hand-drawn creature art. Looks for
 * /assets/creatures/{asset}.svg, then .png, then gives up and renders the
 * geometric fallback. Drop a correctly-named file into public/assets/creatures
 * and it takes over automatically, no code changes needed.
 */
export function CreatureSlot({ asset, alt, className, fallback }: CreatureSlotProps) {
  const [attempt, setAttempt] = useState(0);

  if (attempt >= EXTENSIONS.length) {
    return (
      <div className={className} role="img" aria-label={alt}>
        {fallback}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={attempt}
      src={`/assets/creatures/${asset}.${EXTENSIONS[attempt]}`}
      alt={alt}
      className={className}
      draggable={false}
      onError={() => setAttempt((n) => n + 1)}
    />
  );
}
