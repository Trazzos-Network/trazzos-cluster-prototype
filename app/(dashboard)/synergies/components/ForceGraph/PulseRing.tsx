"use client";

import { motion, useReducedMotion } from "framer-motion";

interface PulseRingProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  enabled?: boolean;
}

/**
 * Pulsing ring animation for new or highlighted nodes
 * Respects user's reduced motion preferences
 */
export function PulseRing({
  cx,
  cy,
  radius,
  color,
  enabled = true,
}: PulseRingProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!enabled || prefersReducedMotion) return null;

  return (
    <>
      {/* Primary pulse */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={3}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary pulse (offset) */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={2}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </>
  );
}

