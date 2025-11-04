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
 * Calculate date range for timeline based on actual data
 * Returns exactly 12 months starting from the earliest date in the data
 */
export function getTimelineDateRangeFromData(
  blocks: TimelineBlock[],
  events?: { date: Date }[]
): {
  start: Date;
  end: Date;
  months: Date[];
} {
  // Find the earliest date from blocks and events
  const allDates: Date[] = [];

  // Get dates from blocks
  for (const block of blocks) {
    allDates.push(block.start, block.end);
  }

  // Get dates from events if provided
  if (events) {
    for (const event of events) {
      allDates.push(event.date);
    }
  }

  if (allDates.length === 0) {
    // Fallback: use current date if no data
    const currentDate = new Date();
    const start = startOfMonth(currentDate);
    const end = endOfMonth(addMonths(start, 11));

    const months: Date[] = [];
    let current = startOfMonth(start);
    for (let i = 0; i < 12; i++) {
      months.push(new Date(current));
      current = startOfMonth(addMonths(current, 1));
    }

    return { start, end, months };
  }

  // Find earliest date
  const earliestDate = new Date(Math.min(...allDates.map((d) => d.getTime())));

  // Start from the beginning of the month containing the earliest date
  const start = startOfMonth(earliestDate);

  // End exactly 12 months later
  const end = endOfMonth(addMonths(start, 11));

  // Generate 12 months
  const months: Date[] = [];
  let current = startOfMonth(start);
  for (let i = 0; i < 12; i++) {
    months.push(new Date(current));
    current = startOfMonth(addMonths(current, 1));
  }

  return { start, end, months };
}

/**
 * Legacy function - kept for backward compatibility but deprecated
 * @deprecated Use getTimelineDateRangeFromData instead
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
 * Extract maintenance periods from synergy blocks grouped by company
 * Returns periods where each company has active maintenance/delivery windows
 */
export function extractMaintenancePeriods(
  blocks: TimelineBlock[]
): Map<
  string,
  Array<{ start: Date; end: Date; planta?: string; unidad?: string }>
> {
  const periodsByCompany = new Map<
    string,
    Array<{ start: Date; end: Date; planta?: string; unidad?: string }>
  >();

  // Group blocks by company and merge overlapping periods
  for (const block of blocks) {
    if (!periodsByCompany.has(block.empresa)) {
      periodsByCompany.set(block.empresa, []);
    }

    const periods = periodsByCompany.get(block.empresa)!;
    periods.push({
      start: block.start,
      end: block.end,
    });
  }

  // Merge overlapping periods for each company
  const mergedPeriods = new Map<
    string,
    Array<{ start: Date; end: Date; planta?: string; unidad?: string }>
  >();

  for (const [empresa, periods] of periodsByCompany.entries()) {
    // Sort by start date
    const sorted = periods.sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    // Merge overlapping periods
    const merged: Array<{
      start: Date;
      end: Date;
      planta?: string;
      unidad?: string;
    }> = [];
    for (const period of sorted) {
      if (merged.length === 0) {
        merged.push({ ...period });
      } else {
        const last = merged[merged.length - 1]!;
        // If periods overlap or are adjacent (within 1 day), merge them
        if (
          period.start <= new Date(last.end.getTime() + 24 * 60 * 60 * 1000)
        ) {
          last.end = period.end > last.end ? period.end : last.end;
        } else {
          merged.push({ ...period });
        }
      }
    }

    mergedPeriods.set(empresa, merged);
  }

  return mergedPeriods;
}

/**
 * Calculate pixel position for a date within the timeline
 * Uses millisecond precision for accurate positioning
 */
export function calculateDatePosition(
  date: Date,
  timelineStart: Date,
  timelineEnd: Date,
  timelineWidth: number
): number {
  // Use millisecond precision for accurate positioning
  const totalMs = timelineEnd.getTime() - timelineStart.getTime();
  const msFromStart = date.getTime() - timelineStart.getTime();

  // Handle edge cases
  if (totalMs <= 0) return 0;
  if (msFromStart < 0) return 0;
  if (msFromStart > totalMs) return timelineWidth;

  return (msFromStart / totalMs) * timelineWidth;
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
