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
    <div className="flex w-full flex-col items-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sunlight-950/60">
        Choose your submarine
      </p>

      <div className="flex h-72 w-full max-w-xl items-end justify-center sm:h-96">
        <CreatureSlot
          asset={`submarine-${current.id}`}
          folder="submarines"
          alt={`${current.label} submarine`}
          className="h-full w-full object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.3)]"
          fallback={
            <GeometricSubmarine
              body={current.body}
              accent={current.accent}
              className="h-full w-full"
            />
          }
        />
      </div>

      {/* Stand the submarine rests on: two flush trapezoids, stacked in normal flow so they can never gap or overlap */}
      <div className="-mt-6 flex w-64 flex-col items-center sm:w-80">
        <div
          className="h-7 w-full bg-[#f2e5b8] sm:h-9"
          style={{ clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)" }}
        />
        <div
          className="h-5 w-[78%] bg-[#b8985c] sm:h-6"
          style={{ clipPath: "polygon(6% 0, 94% 0, 84% 100%, 16% 100%)" }}
        />
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => cycle(-1)}
          aria-label="Previous submarine"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-sunlight-950/20 bg-white/40 text-xl text-sunlight-950 shadow-[0_4px_0_0_rgba(11,42,58,0.25)] transition-transform active:translate-y-[4px] active:shadow-[0_1px_0_0_rgba(11,42,58,0.25)]"
        >
          ◀
        </button>

        <Button
          variant="primary"
          onClick={select}
          className={cn("min-w-[9rem] text-lg", justSelected && "bg-glow-400")}
        >
          {justSelected ? "Selected ✓" : "Select"}
        </Button>

        <button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Next submarine"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-sunlight-950/20 bg-white/40 text-xl text-sunlight-950 shadow-[0_4px_0_0_rgba(11,42,58,0.25)] transition-transform active:translate-y-[4px] active:shadow-[0_1px_0_0_rgba(11,42,58,0.25)]"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
