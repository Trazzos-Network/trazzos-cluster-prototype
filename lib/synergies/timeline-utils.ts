import { SinergiaDetectada, EstadoSinergia, Criticidad } from "@/types/models";
import {
  TimelineBlock,
  SwimLane,
  OverlapIndicator,
  COMPANY_COLORS,
} from "@/types/synergies-viz";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  differenceInDays,
} from "date-fns";

/**
 * Transform synergies into timeline blocks for each company
 */
export function transformToTimelineBlocks(
  sinergias: SinergiaDetectada[]
): TimelineBlock[] {
  const blocks: TimelineBlock[] = [];

  for (const sinergia of sinergias) {
    const [start, end] = sinergia.ventana;

    // Create a block for each company participating in this synergy
    for (const detalle of sinergia.detalle_empresas) {
      blocks.push({
        id: `${sinergia.id}-${detalle.empresa}`,
        sinergiaId: sinergia.id,
        empresa: detalle.empresa,
        insumo: sinergia.insumo,
        start,
        end,
        volumen: detalle.qty,
        unidad: sinergia.unidad_medida,
        estado: sinergia.estado,
        criticidad: detalle.criticidad,
        ahorro: sinergia.ahorro_estimado_monto
          ? sinergia.ahorro_estimado_monto / sinergia.empresas_involucradas
          : undefined,
      });
    }
  }

  return blocks;
}

/**
 * Group timeline blocks by company into swim lanes
 */
export function groupBlocksByCompany(blocks: TimelineBlock[]): SwimLane[] {
  const companyMap = new Map<string, TimelineBlock[]>();

  // Group blocks by company
  for (const block of blocks) {
    if (!companyMap.has(block.empresa)) {
      companyMap.set(block.empresa, []);
    }
    companyMap.get(block.empresa)!.push(block);
  }

  // Convert to swim lanes with colors
  return Array.from(companyMap.entries()).map(([empresa, blocks]) => ({
    empresa,
    blocks: blocks.sort((a, b) => a.start.getTime() - b.start.getTime()),
    color: COMPANY_COLORS[empresa] || "var(--color-muted-foreground)",
  }));
}

/**
 * Calculate date range for timeline (current - 6 months to + 18 months)
 */
export function getTimelineDateRange(currentDate: Date = new Date()): {
  start: Date;
  end: Date;
  months: Date[];
} {
  const start = startOfMonth(addMonths(currentDate, -6));
  const end = endOfMonth(addMonths(currentDate, 18));

  const months: Date[] = [];
  let current = startOfMonth(start);

  while (current <= end) {
    months.push(new Date(current));
    current = startOfMonth(addMonths(current, 1));
  }

  return { start, end, months };
}

/**
 * Calculate overlap indicators - dates where multiple companies have synergies
 */
export function calculateOverlaps(
  blocks: TimelineBlock[],
  months: Date[]
): OverlapIndicator[] {
  const overlaps: OverlapIndicator[] = [];
  const monthOverlaps = new Map<string, Map<string, Set<string>>>(); // month -> empresa -> sinergias

  // Group blocks by month
  for (const month of months) {
    const monthKey = format(month, "yyyy-MM");
    const overlapsInMonth = new Map<string, Set<string>>();

    for (const block of blocks) {
      const blockStart = startOfMonth(block.start);
      const blockEnd = endOfMonth(block.end);

      // Check if block overlaps with this month
      if (month >= blockStart && month <= blockEnd) {
        if (!overlapsInMonth.has(block.empresa)) {
          overlapsInMonth.set(block.empresa, new Set());
        }
        overlapsInMonth.get(block.empresa)!.add(block.sinergiaId);
      }
    }

    // If 2+ companies have synergies in this month, it's an overlap
    if (overlapsInMonth.size >= 2) {
      const empresas = Array.from(overlapsInMonth.keys());
      const allSinergias = new Set<string>();
      let totalVolumen = 0;
      let totalAhorro = 0;

      for (const [empresa, sinergias] of overlapsInMonth.entries()) {
        for (const sinergiaId of sinergias) {
          allSinergias.add(sinergiaId);

          // Find the block to get volume and savings
          const block = blocks.find(
            (b) => b.sinergiaId === sinergiaId && b.empresa === empresa
          );
          if (block) {
            totalVolumen += block.volumen;
            totalAhorro += block.ahorro || 0;
          }
        }
      }

      overlaps.push({
        id: `overlap-${monthKey}`,
        date: month,
        empresas,
        sinergias: Array.from(allSinergias),
        totalVolumen,
        totalAhorro,
      });
    }
  }

  return overlaps;
}

/**
 * Calculate pixel position for a date within the timeline
 */
export function calculateDatePosition(
  date: Date,
  timelineStart: Date,
  timelineEnd: Date,
  timelineWidth: number
): number {
  const totalDays = differenceInDays(timelineEnd, timelineStart);
  const daysFromStart = differenceInDays(date, timelineStart);
  return (daysFromStart / totalDays) * timelineWidth;
}

/**
 * Calculate width in pixels for a date range block
 */
export function calculateBlockWidth(
  start: Date,
  end: Date,
  timelineStart: Date,
  timelineEnd: Date,
  timelineWidth: number
): number {
  const startPos = calculateDatePosition(
    start,
    timelineStart,
    timelineEnd,
    timelineWidth
  );
  const endPos = calculateDatePosition(
    end,
    timelineStart,
    timelineEnd,
    timelineWidth
  );
  return Math.max(endPos - startPos, 10); // Minimum 10px width
}
