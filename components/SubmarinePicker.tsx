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
  const isSelected = previewId === submarineId;

  const index = SUBMARINE_OPTIONS.findIndex((s) => s.id === previewId);
  const current = SUBMARINE_OPTIONS[index] ?? SUBMARINE_OPTIONS[0];

  function cycle(offset: number) {
    const next =
      (index + offset + SUBMARINE_OPTIONS.length) % SUBMARINE_OPTIONS.length;
    setPreviewId(SUBMARINE_OPTIONS[next].id);
  }

  function select() {
    chooseSubmarine(previewId);
  }

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sunlight-950/60">
        Choose your submarine
      </p>

      <div className="flex h-72 w-full max-w-2xl items-end justify-center sm:h-96">
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

      {/* Stand the submarine rests on: two flush trapezoids, same width, tapering continuously from top to bottom */}
      <div className="-mt-6 flex w-64 flex-col items-center sm:w-80">
        <div
          className="h-7 w-full bg-[#f2e5b8] sm:h-9"
          style={{ clipPath: "polygon(10% 0, 90% 0, 82% 100%, 18% 100%)" }}
        />
        <div
          className="h-5 w-full bg-[#b8985c] sm:h-6"
          style={{ clipPath: "polygon(18% 0, 82% 0, 74% 100%, 26% 100%)" }}
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
          className={cn(
            "min-w-[9rem] text-lg",
            isSelected
              ? "bg-emerald-500 text-emerald-950 shadow-[0_5px_0_0_theme(colors.emerald.700)] hover:bg-emerald-400 active:shadow-[0_1px_0_0_theme(colors.emerald.700)]"
              : "bg-amber-400 text-amber-950 shadow-[0_5px_0_0_theme(colors.amber.600)] hover:bg-amber-300 active:shadow-[0_1px_0_0_theme(colors.amber.600)]"
          )}
        >
          {isSelected ? "Selected ✓" : "Select"}
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
