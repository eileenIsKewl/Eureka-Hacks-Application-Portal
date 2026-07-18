interface GeometricSubmarineProps {
  body: string;
  accent: string;
  className?: string;
}

/**
 * Stand-in submarine built from plain shapes, used only until the real
 * hand-drawn submarines are dropped into public/assets/submarines.
 */
export function GeometricSubmarine({ body, accent, className }: GeometricSubmarineProps) {
  return (
    <svg viewBox="0 0 200 120" className={className}>
      <polygon points="168,50 200,36 200,48 186,60 200,72 200,84 168,70" fill={accent} />
      <ellipse cx="95" cy="60" rx="88" ry="42" fill={body} stroke={accent} strokeWidth="2" />
      <path d="M145,20 a42,42 0 0 1 0,80 z" fill={accent} />
      <path d="M58,22 q4,-22 24,-22 q20,0 24,22 z" fill={accent} />
      <path d="M72,2 q-9,-14 -3,-19" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90,2 q7,-11 1,-15" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="68" cy="16" r="3" fill="#dbeafe" />
      <circle cx="82" cy="14" r="4.5" fill="#dbeafe" />
      <circle cx="96" cy="16" r="3" fill="#dbeafe" />
      <circle cx="58" cy="60" r="27" fill="#dbeafe" stroke={accent} strokeWidth="3" />
      <circle cx="106" cy="60" r="14" fill="#dbeafe" stroke={accent} strokeWidth="3" />
      <path d="M68,96 q22,16 42,0 z" fill={body} opacity="0.75" />
    </svg>
  );
}
