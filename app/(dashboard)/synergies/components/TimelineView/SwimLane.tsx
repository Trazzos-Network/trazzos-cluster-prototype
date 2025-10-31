"use client";

import { TimelineBlock, ESTADO_COLORS } from "@/types/synergies-viz";
import { SynergyBlock } from "./SynergyBlock";
import { format } from "date-fns";

interface SwimLaneProps {
  empresa: string;
  blocks: TimelineBlock[];
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
  color,
  laneHeight,
  timelineStart,
  timelineEnd,
  timelineWidth,
  scrollLeft,
  onBlockClick,
  onBlockHover,
}: SwimLaneProps) {
  const calculatePosition = (date: Date): number => {
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromStart =
      (date.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    return (daysFromStart / totalDays) * timelineWidth;
  };

  const calculateWidth = (start: Date, end: Date): number => {
    const startPos = calculatePosition(start);
    const endPos = calculatePosition(end);
    return Math.max(endPos - startPos, 10); // Minimum 10px
  };

  return (
    <div
      className="relative border-b border-border"
      style={{ height: laneHeight }}
    >
      {/* Company label */}
      <div
        className="sticky left-0 z-20 flex items-center h-full px-4 bg-background border-r border-border min-w-[200px]"
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
        className="absolute top-0 left-[200px] h-full"
        style={{
          width: timelineWidth,
          transform: `translateX(-${scrollLeft}px)`,
        }}
      >
        {blocks.map((block) => {
          const position = calculatePosition(block.start);
          const width = calculateWidth(block.start, block.end);

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
