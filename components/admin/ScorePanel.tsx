"use client";

import { Card } from "@/components/ui/Card";

interface ScorePanelProps {
  scoreTechnical: number | null;
  scoreCreativity: number | null;
  scoreFit: number | null;
  onChange: (
    field: "scoreTechnical" | "scoreCreativity" | "scoreFit",
    value: number
  ) => void;
}

const CRITERIA: { key: "scoreTechnical" | "scoreCreativity" | "scoreFit"; label: string }[] = [
  { key: "scoreTechnical", label: "Technical ability" },
  { key: "scoreCreativity", label: "Creativity" },
  { key: "scoreFit", label: "Overall fit" },
];

export function ScorePanel({
  scoreTechnical,
  scoreCreativity,
  scoreFit,
  onChange,
}: ScorePanelProps) {
  const values = { scoreTechnical, scoreCreativity, scoreFit };
  const scored = Object.values(values).filter((v): v is number => typeof v === "number");
  const average =
    scored.length > 0 ? scored.reduce((s, v) => s + v, 0) / scored.length : null;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-glow-300">Scoring</h3>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-white/40">Average</p>
          <p className="text-xl font-semibold text-glow-400">
            {average !== null ? average.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {CRITERIA.map((c) => (
          <div key={c.key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-white/70">{c.label}</span>
              <span className="font-mono text-glow-400">
                {values[c.key] !== null ? values[c.key]!.toFixed(1) : "N/A"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={values[c.key] ?? 0}
              onChange={(e) => onChange(c.key, Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-glow-500"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
