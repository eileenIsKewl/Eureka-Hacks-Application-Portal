export interface SubmarineOption {
  id: string;
  label: string;
  /** Placeholder fill colors, used only until the real art is dropped in. */
  body: string;
  accent: string;
}

export const SUBMARINE_OPTIONS: SubmarineOption[] = [
  { id: "pink", label: "Pink", body: "#f9a8f3", accent: "#a3348f" },
  { id: "orange", label: "Orange", body: "#f5a742", accent: "#9a5a1f" },
  { id: "green", label: "Green", body: "#6cbf4a", accent: "#2f5c1f" },
  { id: "red", label: "Red", body: "#f2603f", accent: "#a3234f" },
  { id: "yellow", label: "Yellow", body: "#f5cf4a", accent: "#a3771f" },
];

export function getSubmarine(id: string): SubmarineOption {
  return SUBMARINE_OPTIONS.find((s) => s.id === id) ?? SUBMARINE_OPTIONS[0];
}
