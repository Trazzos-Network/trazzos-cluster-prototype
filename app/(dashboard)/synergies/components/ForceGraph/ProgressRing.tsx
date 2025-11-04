"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ProgressRingProps {
  cx: number;
  cy: number;
  radius: number;
  progress: number; // 0 to 1
  color?: string;
  strokeWidth?: number;
}

/**
 * Circular progress indicator for RFP timeline
 * Shows completion percentage as animated ring
 */
export function ProgressRing({
  cx,
  cy,
  radius,
  progress,
  color = "var(--color-chart-1)",
  strokeWidth = 4,
}: ProgressRingProps) {
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(
    () => circumference * (1 - Math.max(0, Math.min(1, progress))),
    [circumference, progress]
  );

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeLinecap="round"
      initial={{ strokeDashoffset: circumference }}
      animate={{ strokeDashoffset }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      style={{
        transform: `rotate(-90deg)`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    />
  );
}
