"use client";

import { useMotionValue, animate } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import { Criticidad } from "@/types/models";

interface FlowingParticlesProps {
  edgePath: string;
  color: string;
  criticidad?: Criticidad;
  enabled?: boolean;
}

interface ParticleProps {
  edgePath: string;
  color: string;
  initialOffset: number;
  finalOffset: number;
  duration: number;
  delay: number;
  index: number;
}

function Particle({
  edgePath,
  color,
  initialOffset,
  finalOffset,
  duration,
  delay,
}: ParticleProps) {
  const offsetValue = useMotionValue(initialOffset);
  const [offsetDistance, setOffsetDistance] = useState(`${initialOffset}%`);

  useEffect(() => {
    const controls = animate(offsetValue, finalOffset, {
      duration,
      repeat: Infinity,
      ease: "linear",
      delay,
    });

    // Update offsetDistance on each frame
    const updateOffset = () => {
      const currentValue = offsetValue.get();
      setOffsetDistance(`${currentValue}%`);
      requestAnimationFrame(updateOffset);
    };
    const rafId = requestAnimationFrame(updateOffset);

    return () => {
      controls.stop();
      cancelAnimationFrame(rafId);
    };
  }, [offsetValue, finalOffset, duration, delay]);

  return (
    <circle
      r={3}
      fill={color}
      opacity={0.8}
      style={
        {
          offsetPath: `path('${edgePath}')`,
          offsetRotate: "0deg",
          offsetDistance,
        } as React.CSSProperties & { offsetDistance: string }
      }
    />
  );
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
      {Array.from({ length: particleCount }).map((_, i) => {
        const initialOffset = (i * 100) / particleCount;
        const finalOffset = ((i + 1) * 100) / particleCount;
        const delay = (i * duration) / particleCount;

        return (
          <Particle
            key={i}
            edgePath={edgePath}
            color={color}
            initialOffset={initialOffset}
            finalOffset={finalOffset}
            duration={duration}
            delay={delay}
            index={i}
          />
        );
      })}
    </>
  );
}
