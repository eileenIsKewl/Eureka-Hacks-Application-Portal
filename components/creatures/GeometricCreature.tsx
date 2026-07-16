interface GeometricCreatureProps {
  className?: string;
  glow?: boolean;
}

/**
 * Temporary stand-in creature built from plain shapes — an ellipse body, a
 * triangular tail fin, and an eye. Colored via `currentColor` so a parent can
 * theme it per zone. Replace by dropping real art into /assets/creatures;
 * this never needs to be touched once that happens.
 */
export function GeometricCreature({ className, glow }: GeometricCreatureProps) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 8px currentColor)" } : undefined}
    >
      <polygon points="14,30 0,16 0,44" fill="currentColor" opacity="0.85" />
      <ellipse cx="55" cy="30" rx="38" ry="20" fill="currentColor" />
      <circle cx="82" cy="24" r="4" fill="black" opacity="0.6" />
    </svg>
  );
}
