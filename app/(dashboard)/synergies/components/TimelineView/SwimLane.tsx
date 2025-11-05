"use client";

import { TimelineBlock } from "@/types/synergies-viz";
import { SynergyBlock } from "./SynergyBlock";
import { MaintenancePeriodBlock } from "./MaintenancePeriodBlock";
import {
  calculateDatePosition,
  calculateBlockWidth,
} from "@/lib/synergies/timeline-utils";

interface MaintenancePeriod {
  id: string;
  start: Date;
  end: Date;
  planta?: string;
  unidad?: string;
  criticidad?: string;
}

interface SwimLaneProps {
  empresa: string;
  blocks: TimelineBlock[];
  maintenancePeriods?: MaintenancePeriod[];
  color: string;
  laneHeight: number;
  timelineStart: Date;
  timelineEnd: Date;
  timelineWidth: number;
  scrollLeft: number;
  onBlockClick?: (block: TimelineBlock) => void;
  onBlockHover?: (block: TimelineBlock | null) => void;
}

/**
 * Swim lane component representing one company's timeline
 */
export function SwimLane({
  empresa,
  blocks,
  maintenancePeriods = [],
  color,
  laneHeight,
  timelineStart,
  timelineEnd,
  timelineWidth,
  scrollLeft,
  onBlockClick,
  onBlockHover,
}: SwimLaneProps) {
  // Use shared utility for consistent positioning
  const getPosition = (date: Date): number => {
    return calculateDatePosition(
      date,
      timelineStart,
      timelineEnd,
      timelineWidth
    );
  };

  const getWidth = (start: Date, end: Date): number => {
    return calculateBlockWidth(
      start,
      end,
      timelineStart,
      timelineEnd,
      timelineWidth
    );
  };

  return (
    <div
      className="relative border-b border-border"
      style={{ height: laneHeight }}
    >
      {/* Company label */}
      <div
        className="sticky left-0 z-999 flex items-center h-full px-4 bg-transparent border-r border-border min-w-[200px]"
        style={{
          transform: `translateX(${scrollLeft > 0 ? scrollLeft : 0}px)`,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium">{empresa}</span>
        </div>
      </div>

      {/* Timeline blocks */}
      <div
        className="absolute top-0 left-[200px] h-full z-10 pointer-events-auto"
        style={{
          width: timelineWidth,
        }}
      >
        {/* Maintenance Period Blocks - shown behind synergy blocks */}
        {maintenancePeriods.map((period) => {
          const position = getPosition(period.start);
          const width = getWidth(period.start, period.end);

          return (
            <MaintenancePeriodBlock
              key={period.id}
              id={period.id}
              empresa={empresa}
              start={period.start}
              end={period.end}
              position={position}
              width={width}
              laneHeight={laneHeight}
              planta={period.planta}
              unidad={period.unidad}
              criticidad={period.criticidad}
            />
          );
        })}

        {/* Synergy Blocks - shown on top of maintenance periods */}
        {blocks.map((block) => {
          const position = getPosition(block.start);
          const width = getWidth(block.start, block.end);

          return (
            <SynergyBlock
              key={block.id}
              block={block}
              position={position}
              width={width}
              laneHeight={laneHeight}
              onClick={() => onBlockClick?.(block)}
              onHover={(hovered) => onBlockHover?.(hovered ? block : null)}
            />
          );
        })}
      </div>
    </div>
  );
}
