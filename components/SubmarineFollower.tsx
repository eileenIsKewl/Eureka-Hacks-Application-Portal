"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { getSubmarine } from "@/lib/submarines";
import { useSubmarineChoice } from "@/hooks/useSubmarineChoice";
import { useSectionInView } from "@/hooks/useSectionInView";
import { zoneSectionId } from "@/lib/scrollToZone";
import { CreatureSlot } from "@/components/creatures/CreatureSlot";
import { GeometricSubmarine } from "@/components/creatures/GeometricSubmarine";

/**
 * Your chosen submarine, pinned to the edge of the screen and sinking down
 * with you as you scroll. useScroll tracks raw scroll progress; useSpring
 * adds the trailing, slightly-behind-you lag so it feels like it's actually
 * being dragged through water rather than snapped to a scrollbar. Hidden
 * while the Sunlight section is in view so it doesn't duplicate the picker
 * there. Watches its own visibility (rather than taking it as a prop) since
 * this component only mounts once the real sections are in the DOM, which
 * is exactly when the IntersectionObserver needs to attach.
 */
export function SubmarineFollower() {
  const { submarineId, loaded } = useSubmarineChoice();
  const sub = getSubmarine(submarineId);
  const sunlightInView = useSectionInView(zoneSectionId("sunlight"));
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 18,
    mass: 0.8,
  });
  const top = useTransform(smoothProgress, [0, 1], ["4%", "82%"]);

  if (!loaded) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed right-2 z-30 h-36 w-56 sm:right-6 sm:h-52 sm:w-80 lg:right-10 lg:h-64 lg:w-[26rem]"
      style={{ top }}
      initial={false}
      animate={{ opacity: sunlightInView ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <CreatureSlot
          asset={`submarine-${sub.id}`}
          folder="submarines"
          alt="Your submarine"
          className="h-full w-full object-contain drop-shadow-[0_20px_26px_rgba(0,0,0,0.4)]"
          fallback={
            <GeometricSubmarine body={sub.body} accent={sub.accent} className="h-full w-full" />
          }
        />
      </motion.div>
    </motion.div>
  );
}
