"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { getSubmarine } from "@/lib/submarines";
import { useSubmarineChoice } from "@/hooks/useSubmarineChoice";
import { CreatureSlot } from "@/components/creatures/CreatureSlot";
import { GeometricSubmarine } from "@/components/creatures/GeometricSubmarine";

/**
 * Your chosen submarine, pinned to the edge of the screen and sinking down
 * with you as you scroll. useScroll tracks raw scroll progress; useSpring
 * adds the trailing, slightly-behind-you lag so it feels like it's actually
 * being dragged through water rather than snapped to a scrollbar.
 */
export function SubmarineFollower() {
  const { submarineId, loaded } = useSubmarineChoice();
  const sub = getSubmarine(submarineId);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 18,
    mass: 0.8,
  });
  const top = useTransform(smoothProgress, [0, 1], ["4%", "92%"]);

  if (!loaded) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed right-3 z-30 h-20 w-32 sm:right-6 sm:h-24 sm:w-40 lg:right-10 lg:h-28 lg:w-48"
      style={{ top }}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <CreatureSlot
          asset={`submarine-${sub.id}`}
          alt="Your submarine"
          className="h-full w-full object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.4)]"
          fallback={
            <GeometricSubmarine body={sub.body} accent={sub.accent} className="h-full w-full" />
          }
        />
      </motion.div>
    </motion.div>
  );
}
