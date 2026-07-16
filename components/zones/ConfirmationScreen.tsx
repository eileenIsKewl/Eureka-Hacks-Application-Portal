"use client";

import { motion } from "framer-motion";
import { CreatureSlot } from "@/components/creatures/CreatureSlot";
import { GeometricCreature } from "@/components/creatures/GeometricCreature";
import { BubbleField } from "@/components/ui/BubbleField";

interface ConfirmationScreenProps {
  applicantId: string | null;
}

export function ConfirmationScreen({ applicantId }: ConfirmationScreenProps) {
  return (
    <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <BubbleField count={22} />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mb-6 h-32 w-32 text-glow-300 animate-pulse-glow"
      >
        <CreatureSlot
          asset="discovery"
          alt="A glowing deep-sea discovery"
          className="h-full w-full"
          fallback={<GeometricCreature className="h-full w-full" glow />}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 mb-4 font-display text-3xl text-glow-300 sm:text-4xl"
      >
        You found something down here.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="relative z-10 max-w-md text-white/70"
      >
        Your application just reached the bottom of the trench — the deepest
        point we go. It&apos;s been logged, and our crew will surface with a
        decision soon.
      </motion.p>

      {applicantId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 mt-6 font-mono text-xs text-white/30"
        >
          Dive record: {applicantId}
        </motion.p>
      )}
    </div>
  );
}
