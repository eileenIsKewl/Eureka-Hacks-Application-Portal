/**
 * One continuous gradient behind every zone section, instead of each
 * section carrying its own. Section boundaries would otherwise show as a
 * visible seam where two independent gradients meet; a single gradient
 * spanning the whole scroll height reads as one unbroken descent instead.
 */
export function DescentBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background: `linear-gradient(
          to bottom,
          var(--color-sunlight-300) 0%,
          var(--color-sunlight-600) 9%,
          var(--color-twilight-500) 20%,
          var(--color-twilight-800) 33%,
          var(--color-midnight-600) 42%,
          var(--color-midnight-900) 56%,
          var(--color-abyssal-600) 62%,
          var(--color-abyssal-900) 76%,
          var(--color-hadal-800) 84%,
          var(--color-hadal-950) 100%
        )`,
      }}
    />
  );
}
