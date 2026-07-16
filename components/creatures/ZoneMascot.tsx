"use client";

import { motion } from "framer-motion";
import type { ZoneId } from "@/lib/data/types";
import { CreatureSlot } from "./CreatureSlot";
import { GeometricCreature } from "./GeometricCreature";

const ZONE_GLOW_CLASS: Record<ZoneId, string> = {
  sunlight: "text-sunlight-600",
  twilight: "text-twilight-300",
  midnight: "text-glow-500",
  abyssal: "text-glow-400",
  hadal: "text-glow-300",
};

interface ZoneMascotProps {
  zoneId: ZoneId;
  active?: boolean;
  size?: number;
}

/**
 * The companion creature that swims alongside the depth gauge — one per
 * zone, growing more bioluminescent as the descent continues. Swap art by
 * adding /assets/creatures/{zoneId}-companion.svg (see CreatureSlot).
 */
export function ZoneMascot({ zoneId, active, size = 44 }: ZoneMascotProps) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      className={ZONE_GLOW_CLASS[zoneId]}
      style={{ width: size, height: size * 0.6 }}
    >
      <CreatureSlot
        asset={`${zoneId}-companion`}
        alt={`${zoneId} zone companion creature`}
        className="h-full w-full"
        fallback={
          <GeometricCreature className="h-full w-full" glow={active} />
        }
      />
    </motion.div>
  );
}
