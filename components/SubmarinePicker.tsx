"use client";

import { useState } from "react";
import { SUBMARINE_OPTIONS } from "@/lib/submarines";
import { useSubmarineChoice } from "@/hooks/useSubmarineChoice";
import { CreatureSlot } from "@/components/creatures/CreatureSlot";
import { GeometricSubmarine } from "@/components/creatures/GeometricSubmarine";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function SubmarinePicker() {
  const { submarineId, chooseSubmarine } = useSubmarineChoice();
  const [previewId, setPreviewId] = useState(submarineId);
  const [justSelected, setJustSelected] = useState(false);

  const index = SUBMARINE_OPTIONS.findIndex((s) => s.id === previewId);
  const current = SUBMARINE_OPTIONS[index] ?? SUBMARINE_OPTIONS[0];

  function cycle(offset: number) {
    const next =
      (index + offset + SUBMARINE_OPTIONS.length) % SUBMARINE_OPTIONS.length;
    setPreviewId(SUBMARINE_OPTIONS[next].id);
    setJustSelected(false);
  }

  function select() {
    chooseSubmarine(previewId);
    setJustSelected(true);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-[0.2em] text-sunlight-900/60">
        Choose your submarine
      </p>

      <div className="flex h-36 w-56 items-center justify-center">
        <CreatureSlot
          asset={`submarine-${current.id}`}
          alt={`${current.label} submarine`}
          className="h-full w-full object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.25)]"
          fallback={
            <GeometricSubmarine
              body={current.body}
              accent={current.accent}
              className="h-full w-full"
            />
          }
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => cycle(-1)}
          aria-label="Previous submarine"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sunlight-950/20 bg-white/40 text-sunlight-950 shadow-[0_3px_0_0_rgba(11,42,58,0.25)] transition-transform active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(11,42,58,0.25)]"
        >
          ◀
        </button>

        <Button
          variant="primary"
          onClick={select}
          className={cn("min-w-[7rem]", justSelected && "bg-glow-400")}
        >
          {justSelected ? "Selected ✓" : "Select"}
        </Button>

        <button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Next submarine"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sunlight-950/20 bg-white/40 text-sunlight-950 shadow-[0_3px_0_0_rgba(11,42,58,0.25)] transition-transform active:translate-y-[3px] active:shadow-[0_1px_0_0_rgba(11,42,58,0.25)]"
        >
          ▶
        </button>
      </div>

      <p className="text-xs text-sunlight-950/50">{current.label}</p>
    </div>
  );
}
