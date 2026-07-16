interface BubbleFieldProps {
  count?: number;
  burst?: boolean;
  className?: string;
}

// Deterministic pseudo-random spread so bubbles look organic without
// causing a server/client render mismatch.
function seededSpread(i: number, n: number) {
  const left = (i * 137.5) % 100;
  const size = 4 + ((i * 53) % 14);
  const delay = (i * 0.37) % (n * 0.4);
  const drift = ((i * 71) % 60) - 30;
  return { left, size, delay, drift };
}

/**
 * Bubbles drifting upward past the viewer — the constant ambient cue that
 * we're underwater, plus an extra burst fired during zone transitions.
 */
export function BubbleField({ count = 18, burst = false, className }: BubbleFieldProps) {
  const items = Array.from({ length: count }, (_, i) => {
    const { left, size, delay, drift } = seededSpread(i, count);
    const duration = burst ? 1.4 + ((i * 29) % 5) * 0.15 : 5 + ((i * 29) % 6);
    return { left, size, delay: burst ? delay * 0.1 : delay, drift, duration, key: i };
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {items.map((b) => (
        <span
          key={b.key}
          className="absolute bottom-0 rounded-full bg-white/30 animate-bubble-rise"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ["--bubble-drift" as string]: `${b.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
