"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Criticidad } from "@/types/models";

interface FlowingParticlesProps {
  edgePath: string;
  color: string;
  criticidad?: Criticidad;
  enabled?: boolean;
}

/**
 * Animated particles that flow along edge paths
 * Speed based on criticidad (faster for high priority)
 */
export function FlowingParticles({
  edgePath,
  color,
  criticidad,
  enabled = true,
}: FlowingParticlesProps) {
  // Calculate speed based on criticidad
  const duration = useMemo(() => {
    if (!criticidad) return 3;
    switch (criticidad) {
      case "Alta":
        return 1.5; // Fast
      case "Media":
        return 2.5; // Medium
      case "Baja":
        return 4; // Slow
      default:
        return 3;
    }
  }, [criticidad]);

  // Number of particles based on criticidad
  const particleCount = useMemo(() => {
    if (!criticidad) return 2;
    switch (criticidad) {
      case "Alta":
        return 4;
      case "Media":
        return 3;
      case "Baja":
        return 2;
      default:
        return 2;
    }
  }, [criticidad]);

  if (!enabled) return null;

  return (
    <>
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.circle
          key={i}
          r={3}
          fill={color}
          opacity={0.8}
          initial={{ offsetDistance: `${(i * 100) / particleCount}%` }}
          animate={{ offsetDistance: `${((i + 1) * 100) / particleCount}%` }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay: (i * duration) / particleCount,
          }}
          style={{
            offsetPath: `path('${edgePath}')`,
            offsetRotate: "0deg",
          }}
        />
      ))}
    </>
  );
}

