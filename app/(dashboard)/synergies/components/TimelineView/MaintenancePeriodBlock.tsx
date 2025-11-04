"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Wrench } from "lucide-react";

interface MaintenancePeriodBlockProps {
  id: string;
  empresa: string;
  start: Date;
  end: Date;
  position: number;
  width: number;
  laneHeight: number;
  planta?: string;
  unidad?: string;
  criticidad?: string;
}

/**
 * Maintenance period block component - horizontal rectangle showing maintenance window
 */
export function MaintenancePeriodBlock({
  id,
  empresa,
  start,
  end,
  position,
  width,
  laneHeight,
  planta,
  unidad,
  criticidad,
}: MaintenancePeriodBlockProps) {
  const blockHeight = Math.min(laneHeight - 8, 60);
  const blockY = (laneHeight - blockHeight) / 2;

  return (
    <motion.div
      className="absolute cursor-pointer group z-0"
      style={{
        left: position,
        top: blockY,
        width: Math.max(width, 80), // Minimum readable width
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02, zIndex: 5 }}
    >
      <div
        className="relative h-full rounded-md border-2 transition-all"
        style={{
          height: blockHeight,
          backgroundColor: "var(--color-muted)/0.2",
          borderColor: "var(--color-muted-foreground)",
          borderStyle: "solid",
          borderWidth: 2,
        }}
      >
        {/* Content */}
        <div className="h-full px-2 py-1 flex flex-col justify-center overflow-hidden">
          <div className="flex items-center gap-1.5">
            <Wrench className="h-3 w-3 text-muted-foreground" />
            <div className="text-xs font-semibold truncate text-muted-foreground">
              Mantenimiento
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground truncate mt-0.5">
            {format(start, "dd MMM", { locale: es })} -{" "}
            {format(end, "dd MMM", { locale: es })}
          </div>
          {(planta || unidad) && (
            <div className="text-[10px] text-muted-foreground truncate mt-0.5">
              {planta && `${planta} `}
              {unidad}
            </div>
          )}
        </div>

        {/* Hover tooltip shadow */}
        <div
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm"
          style={{
            backgroundColor: "var(--color-muted-foreground)",
            opacity: 0.1,
          }}
        />
      </div>
    </motion.div>
  );
}
