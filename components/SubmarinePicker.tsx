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
    <div className="flex flex-col items-center">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-sunlight-950/60">
        Choose your submarine
      </p>

      <div className="relative flex h-40 w-56 items-end justify-center">
        <div className="relative z-10 flex h-36 w-56 items-center justify-center">
          <CreatureSlot
            asset={`submarine-${current.id}`}
            folder="submarines"
            alt={`${current.label} submarine`}
            className="h-full w-full object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]"
            fallback={
              <GeometricSubmarine
                body={current.body}
                accent={current.accent}
                className="h-full w-full"
              />
            }
          />
        </div>

        {/* Stand the submarine rests on */}
        <div className="absolute bottom-0 h-9 w-36">
          <div
            className="absolute inset-x-0 top-0 h-6 bg-[#f2e5b8]"
            style={{ clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0% 100%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-4 bg-[#c2a968]"
            style={{ clipPath: "polygon(4% 0, 96% 0, 88% 100%, 12% 100%)" }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4">
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
    </div>
  );
}
