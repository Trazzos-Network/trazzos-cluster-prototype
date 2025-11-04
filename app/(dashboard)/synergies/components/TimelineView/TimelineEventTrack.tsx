"use client";

import { useMemo } from "react";
import { TimelineEvent } from "@/types/synergies-viz";
import { TimelineMilestone } from "./TimelineMilestone";
import { calculateDatePosition } from "@/lib/synergies/timeline-utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineEventTrackProps {
  events: TimelineEvent[];
  timelineWidth: number;
  timelineStart: Date;
  timelineEnd: Date;
  onEventHover?: (event: TimelineEvent | null) => void;
  onEventClick?: (event: TimelineEvent) => void;
  selectedEventTypes?: string[];
}

/**
 * Timeline event track showing all milestones above swim lanes
 */
export function TimelineEventTrack({
  events,
  timelineWidth,
  timelineStart,
  timelineEnd,
  onEventHover,
  onEventClick,
  selectedEventTypes,
}: TimelineEventTrackProps) {
  // Filter events by selected types
  const filteredEvents = useMemo(() => {
    if (!selectedEventTypes || selectedEventTypes.length === 0) {
      return events;
    }
    return events.filter((e) => selectedEventTypes.includes(e.type));
  }, [events, selectedEventTypes]);

  // Group events by date (rounded to day) to handle overlapping markers
  // But use actual event dates for positioning
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, TimelineEvent[]>();
    for (const event of filteredEvents) {
      // Use date rounded to day for grouping, but keep original date for positioning
      const dateKey = event.date.toISOString().split("T")[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    }
    return grouped;
  }, [filteredEvents]);

  // Calculate positions for all events using actual event dates
  const eventPositions = useMemo(() => {
    const positions: Array<{
      event: TimelineEvent;
      position: number;
      stackIndex: number;
    }> = [];

    for (const dateEvents of eventsByDate.values()) {
      // Stack overlapping events vertically
      dateEvents.forEach((event, index) => {
        // Use the actual event date for positioning, not the rounded date key
        const position = calculateDatePosition(
          event.date,
          timelineStart,
          timelineEnd,
          timelineWidth
        );

        positions.push({
          event,
          position,
          stackIndex: index,
        });
      });
    }

    return positions;
  }, [eventsByDate, timelineStart, timelineEnd, timelineWidth]);

  return (
    <div className="relative" style={{ height: 80 }}>
      {/* Track label */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-xs font-medium text-muted-foreground border-r border-border pr-2 bg-background"
        style={{ width: 200 }}
      >
        Eventos
      </div>

      {/* Event track - aligned with TimeAxis */}
      <div
        className="absolute border-l-2 border-amber-500 left-[200px] right-0 top-0 bottom-0"
        style={{ paddingLeft: 200 }}
      >
        {/* Render milestones */}
        {eventPositions.map(({ event, position }) => (
          <TimelineMilestone
            key={event.id}
            event={event}
            position={position}
            onHover={onEventHover}
            onClick={onEventClick}
          />
        ))}

        {/* Event count badges for dates with multiple events */}
        {Array.from(eventsByDate.entries())
          .filter(([, events]) => events.length > 1)
          .map(([dateKey, dateEvents]) => {
            // Use the first event's date for positioning the badge
            const firstEventDate = dateEvents[0]!.date;
            const position = calculateDatePosition(
              firstEventDate,
              timelineStart,
              timelineEnd,
              timelineWidth
            );

            return (
              <TooltipProvider key={dateKey}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute top-8 cursor-pointer"
                      style={{ left: position - 12 }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {dateEvents.length}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <div className="font-semibold text-xs">
                        {dateEvents.length} eventos
                      </div>
                      {dateEvents.map((e) => (
                        <div key={e.id} className="text-xs">
                          • {e.label}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
      </div>
    </div>
  );
}
