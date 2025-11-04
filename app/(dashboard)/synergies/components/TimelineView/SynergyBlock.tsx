"use client";

import { motion } from "framer-motion";
import {
  TimelineBlock,
  ESTADO_COLORS,
  CRITICIDAD_COLORS,
} from "@/types/synergies-viz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SynergyBlockProps {
  block: TimelineBlock;
  position: number;
  width: number;
  laneHeight: number;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}

/**
 * Synergy block component representing a single synergy in the timeline
 */
export function SynergyBlock({
  block,
  position,
  width,
  laneHeight,
  onClick,
  onHover,
}: SynergyBlockProps) {
  const estadoColor = ESTADO_COLORS[block.estado];
  const criticidadColor = CRITICIDAD_COLORS[block.criticidad];
  const isDashed =
    block.estado === "pendiente" || block.estado === "recomendada";

  const blockHeight = Math.min(laneHeight - 8, 100);
  const blockY = (laneHeight - blockHeight) / 2;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: position,
        top: blockY,
        width: Math.max(width, 100), // Minimum readable width
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div
        className="relative h-full rounded-md border-2 transition-all"
        style={{
          height: blockHeight,
          backgroundColor: "var(--color-background)",
          borderColor: estadoColor,
          borderStyle: isDashed ? "dashed" : "solid",
          borderWidth: block.criticidad === "Alta" ? 3 : 2,
        }}
      >
        {/* Criticidad indicator (left border) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
          style={{ backgroundColor: criticidadColor }}
        />

        {/* Content */}
        <div className="h-full px-2 py-1 flex flex-col justify-center overflow-hidden">
          <div
            className="text-xs font-semibold truncate"
            style={{ color: estadoColor }}
          >
            {block.insumo}
          </div>
          <div className="text-[10px] text-muted-foreground truncate mt-0.5">
            {format(block.start, "dd MMM", { locale: es })} -{" "}
            {format(block.end, "dd MMM", { locale: es })}
          </div>
          <div
            className="text-[10px] font-medium mt-0.5"
            style={{ color: estadoColor }}
          >
            {block.volumen} {block.unidad}
          </div>
          {block.ahorro && (
            <div
              className="text-[10px] font-medium mt-0.5"
              style={{ color: "var(--color-chart-3)" }}
            >
              $
              {block.ahorro.toLocaleString("es-CO", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              })}
            </div>
          )}
        </div>

        {/* Hover tooltip shadow */}
        <div
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm"
          style={{ backgroundColor: estadoColor, opacity: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
