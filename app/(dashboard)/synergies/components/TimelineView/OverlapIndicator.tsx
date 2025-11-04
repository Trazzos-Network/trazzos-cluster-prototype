"use client";

import { OverlapIndicator as OverlapIndicatorType } from "@/types/synergies-viz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OverlapIndicatorProps {
  overlap: OverlapIndicatorType;
  position: number;
  swimLanes: { empresa: string; index: number }[];
  totalHeight: number;
}

/**
 * Vertical indicator showing where multiple companies have synergies on the same date
 */
export function OverlapIndicator({
  overlap,
  position,
  swimLanes,
}: OverlapIndicatorProps) {
  const laneIndices = overlap.empresas
    .map((empresa) => {
      const lane = swimLanes.find((l) => l.empresa === empresa);
      return lane?.index ?? -1;
    })
    .filter((idx) => idx >= 0);

  if (laneIndices.length < 2) return null;

  const topLane = Math.min(...laneIndices);
  const bottomLane = Math.max(...laneIndices);
  const laneHeight = 120; // Should match SwimLane height
  const top = topLane * laneHeight + laneHeight / 2;
  const bottom = bottomLane * laneHeight + laneHeight / 2;

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: position - 1,
        top: top,
        height: bottom - top,
      }}
    >
      {/* Vertical line */}
      <div
        className="w-0.5 h-full mx-auto"
        style={{ backgroundColor: "var(--color-primary)" }}
      />

      {/* Overlap badge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap shadow-lg border-2 border-background"
        style={{ minWidth: "24px" }}
      >
        {overlap.empresas.length}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 bg-popover text-popover-foreground border border-border rounded-md p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <div className="text-sm font-semibold mb-2">
          {format(overlap.date, "MMMM yyyy", { locale: es })}
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          {overlap.empresas.length} empresas con sinergias
        </div>
        <div className="text-xs">
          <div>Volumen total: {overlap.totalVolumen.toLocaleString()}</div>
          <div className="text-[var(--color-chart-3)]">
            Ahorro: $
            {overlap.totalAhorro.toLocaleString("es-CO", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
