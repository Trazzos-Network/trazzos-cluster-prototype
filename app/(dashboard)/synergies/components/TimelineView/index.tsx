"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { SinergiaDetectada } from "@/types/models";
import { TimelineBlock } from "@/types/synergies-viz";
import {
  transformToTimelineBlocks,
  groupBlocksByCompany,
  getTimelineDateRange,
  calculateOverlaps,
  calculateDatePosition,
} from "@/lib/synergies/timeline-utils";
import { TimeAxis } from "./TimeAxis";
import { SwimLane } from "./SwimLane";
import { OverlapIndicator } from "./OverlapIndicator";
import { TimeScrubber } from "./TimeScrubber";
import { Card, CardContent } from "@/components/ui/card";

interface TimelineViewProps {
  sinergias: SinergiaDetectada[];
  onBlockClick?: (block: TimelineBlock) => void;
}

const LANE_HEIGHT = 120;
const LABEL_WIDTH = 200;

/**
 * Main Timeline View component showing synergies in a Gantt-style timeline
 */
export function TimelineView({ sinergias, onBlockClick }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<TimelineBlock | null>(null);
  const [timelineWidth, setTimelineWidth] = useState(2400); // Default width

  // Transform data
  const blocks = useMemo(
    () => transformToTimelineBlocks(sinergias),
    [sinergias]
  );

  const swimLanes = useMemo(() => groupBlocksByCompany(blocks), [blocks]);

  const {
    start: timelineStart,
    end: timelineEnd,
    months,
  } = useMemo(() => getTimelineDateRange(), []);

  const overlaps = useMemo(
    () => calculateOverlaps(blocks, months),
    [blocks, months]
  );

  // Update timeline width based on container
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        setTimelineWidth(Math.max(containerWidth - LABEL_WIDTH, 2400));
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Filter blocks by selected date if scrubber is active
  const filteredBlocks = useMemo(() => {
    if (!selectedDate) return blocks;

    return blocks.filter((block) => {
      return block.start <= selectedDate && block.end >= selectedDate;
    });
  }, [blocks, selectedDate]);

  const filteredSwimLanes = useMemo(() => {
    if (!selectedDate) return swimLanes;

    const filteredBlocksByCompany = new Map<string, TimelineBlock[]>();
    for (const block of filteredBlocks) {
      if (!filteredBlocksByCompany.has(block.empresa)) {
        filteredBlocksByCompany.set(block.empresa, []);
      }
      filteredBlocksByCompany.get(block.empresa)!.push(block);
    }

    return swimLanes
      .map((lane) => ({
        ...lane,
        blocks: filteredBlocksByCompany.get(lane.empresa) || [],
      }))
      .filter((lane) => lane.blocks.length > 0);
  }, [swimLanes, filteredBlocks, selectedDate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = swimLanes.length * LANE_HEIGHT;

  return (
    <Card>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full overflow-auto"
          style={{ height: "calc(100vh - 200px)", minHeight: 600 }}
          onScroll={handleScroll}
        >
          {/* Time Axis */}
          <div className="sticky top-0 z-20 bg-background">
            <div style={{ width: LABEL_WIDTH, height: 60 }} />
            <div
              className="absolute top-0 left-0"
              style={{ paddingLeft: LABEL_WIDTH }}
            >
              <TimeAxis
                months={months}
                timelineStart={timelineStart}
                timelineEnd={timelineEnd}
                width={timelineWidth}
                scrollLeft={scrollLeft}
              />
            </div>
          </div>

          {/* Swim Lanes */}
          <div className="relative" style={{ minHeight: totalHeight }}>
            {filteredSwimLanes.map((lane, index) => (
              <SwimLane
                key={lane.empresa}
                empresa={lane.empresa}
                blocks={lane.blocks}
                color={lane.color}
                laneHeight={LANE_HEIGHT}
                timelineStart={timelineStart}
                timelineEnd={timelineEnd}
                timelineWidth={timelineWidth}
                scrollLeft={scrollLeft}
                onBlockClick={onBlockClick}
                onBlockHover={setHoveredBlock}
              />
            ))}

            {/* Overlap Indicators */}
            {overlaps.map((overlap) => {
              const position = calculateDatePosition(
                overlap.date,
                timelineStart,
                timelineEnd,
                timelineWidth
              );

              return (
                <OverlapIndicator
                  key={overlap.id}
                  overlap={overlap}
                  position={position}
                  swimLanes={swimLanes.map((lane, index) => ({
                    empresa: lane.empresa,
                    index,
                  }))}
                  totalHeight={totalHeight}
                />
              );
            })}
          </div>

          {/* Time Scrubber */}
          <TimeScrubber
            currentDate={selectedDate || new Date()}
            minDate={timelineStart}
            maxDate={timelineEnd}
            timelineWidth={timelineWidth}
            onDateChange={setSelectedDate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
