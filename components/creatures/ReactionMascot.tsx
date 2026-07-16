"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ZoneId } from "@/lib/data/types";
import { CreatureSlot } from "./CreatureSlot";

interface ReactionMascotProps {
  zoneId: ZoneId;
  show: boolean;
}

/**
 * Small mascot that pops in to celebrate a completed step. Swap art by
 * adding /assets/creatures/reaction-{zoneId}.svg (see CreatureSlot).
 */
export function ReactionMascot({ zoneId, show }: ReactionMascotProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="text-glow-400"
        >
          <CreatureSlot
            asset={`reaction-${zoneId}`}
            alt="Step complete"
            className="h-10 w-10"
            fallback={
              <svg viewBox="0 0 40 40" className="h-10 w-10">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="currentColor"
                  opacity="0.15"
                />
                <circle cx="20" cy="20" r="12" fill="currentColor" />
                <path
                  d="M14 20l4 5 8-10"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
