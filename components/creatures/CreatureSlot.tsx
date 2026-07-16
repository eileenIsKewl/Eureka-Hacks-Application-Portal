"use client";

import { useEffect, useRef, useState } from "react";

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
  const imgRef = useRef<HTMLImageElement>(null);

  // The image can finish failing to load before React hydrates and attaches
  // onError (a server-rendered <img> starts fetching immediately), which
  // would otherwise miss the error event entirely. Check the already-settled
  // state on mount as a fallback to onError.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setAttempt((n) => n + 1);
    }
  }, [attempt]);

  if (attempt >= EXTENSIONS.length) {
    return (
      <div className={className} role="img" aria-label={alt}>
        {fallback}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- probes for a file that may not exist; next/image can't do that
    <img
      key={attempt}
      ref={imgRef}
      src={`/assets/creatures/${asset}.${EXTENSIONS[attempt]}`}
      alt={alt}
      className={className}
      draggable={false}
      onError={() => setAttempt((n) => n + 1)}
    />
  );
}
