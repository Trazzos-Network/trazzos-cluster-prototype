"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { SinergiaDetectada } from "@/types/models";
import { TimelineBlock, TimelineEvent } from "@/types/synergies-viz";
import {
  transformToTimelineBlocks,
  groupBlocksByCompany,
  getTimelineDateRange,
  calculateOverlaps,
  calculateDatePosition,
} from "@/lib/synergies/timeline-utils";
import {
  extractAllTimelineEvents,
  getEventTypeIcon,
} from "@/lib/synergies/timeline-events";
import { TimeAxis } from "./TimeAxis";
import { SwimLane } from "./SwimLane";
import { OverlapIndicator } from "./OverlapIndicator";
// Removed TimeScrubber - date selection now integrated into TimeAxis
import { TimelineEventTrack } from "./TimelineEventTrack";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TimelineViewProps {
  sinergias: SinergiaDetectada[];
  onBlockClick?: (block: TimelineBlock) => void;
}

const LANE_HEIGHT = 120;
const LABEL_WIDTH = 200;
const EVENT_TRACK_HEIGHT = 80;

const EVENT_TYPE_LABELS: Record<string, string> = {
  detection: "Detecciones",
  rfp_emission: "RFP Emitidas",
  rfp_closing: "Cierres RFP",
  rfp_decision: "Decisiones RFP",
  committee_decision: "Decisiones Comité",
  po_emission: "POs Emitidas",
  update: "Actualizaciones",
  delivery_window: "Inicio Entrega",
};

/**
 * Main Timeline View component showing synergies in a Gantt-style timeline
 */
export function TimelineView({ sinergias, onBlockClick }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<TimelineBlock | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [showEventFilters, setShowEventFilters] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(2400); // Default width

  // Transform data
  const blocks = useMemo(
    () => transformToTimelineBlocks(sinergias),
    [sinergias]
  );

  const swimLanes = useMemo(() => groupBlocksByCompany(blocks), [blocks]);

  // Extract timeline events
  const timelineEvents = useMemo(
    () => extractAllTimelineEvents(sinergias),
    [sinergias]
  );

  // Get unique event types for filtering
  const availableEventTypes = useMemo(() => {
    const types = new Set(timelineEvents.map((e) => e.type));
    return Array.from(types);
  }, [timelineEvents]);

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

  // Filter blocks by focused date (optional - for highlighting specific date)
  const filteredBlocks = useMemo(() => {
    if (!focusedDate) return blocks;

    return blocks.filter((block) => {
      return block.start <= focusedDate && block.end >= focusedDate;
    });
  }, [blocks, focusedDate]);

  const filteredSwimLanes = useMemo(() => {
    if (!focusedDate) return swimLanes;

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
  }, [swimLanes, filteredBlocks, focusedDate]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = swimLanes.length * LANE_HEIGHT;

  const handleEventTypeToggle = (eventType: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(eventType)
        ? prev.filter((t) => t !== eventType)
        : [...prev, eventType]
    );
  };

  const handleSelectAllEventTypes = () => {
    setSelectedEventTypes(availableEventTypes);
  };

  const handleDeselectAllEventTypes = () => {
    setSelectedEventTypes([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cronograma de Sinergias</CardTitle>
            <CardDescription>
              Vista cronológica completa de sinergias, eventos y hitos
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{timelineEvents.length} Eventos</Badge>
            <Badge variant="outline">{sinergias.length} Sinergias</Badge>
            <Popover open={showEventFilters} onOpenChange={setShowEventFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar Eventos
                  {selectedEventTypes.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedEventTypes.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">Tipos de Evento</div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={handleSelectAllEventTypes}
                      >
                        Todos
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={handleDeselectAllEventTypes}
                      >
                        Ninguno
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableEventTypes.map((eventType) => (
                      <div
                        key={eventType}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                        onClick={() => handleEventTypeToggle(eventType)}
                      >
                        <Checkbox
                          checked={selectedEventTypes.includes(eventType)}
                          onCheckedChange={() =>
                            handleEventTypeToggle(eventType)
                          }
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm">
                            {getEventTypeIcon(eventType as any)}
                          </span>
                          <span className="text-sm">
                            {EVENT_TYPE_LABELS[eventType] || eventType}
                          </span>
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px]"
                          >
                            {
                              timelineEvents.filter((e) => e.type === eventType)
                                .length
                            }
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full overflow-auto"
          style={{ height: "calc(100vh - 300px)", minHeight: 600 }}
          onScroll={handleScroll}
        >
          {/* Time Axis - Master reference for all timeline positioning */}
          <div className="sticky top-0 z-20 bg-background border-b">
            <TimeAxis
              months={months}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              width={timelineWidth}
              scrollLeft={scrollLeft}
              onDateClick={(date) => {
                setFocusedDate(date);
                setSelectedDate(date);
                // Scroll to date if needed
                const position = calculateDatePosition(
                  date,
                  timelineStart,
                  timelineEnd,
                  timelineWidth
                );
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    left:
                      position +
                      LABEL_WIDTH -
                      containerRef.current.clientWidth / 2,
                    behavior: "smooth",
                  });
                }
              }}
              selectedDate={focusedDate || selectedDate}
            />
          </div>

          {/* Event Track - Aligned with TimeAxis */}
          <div className="sticky top-[80px] z-15 bg-background/95 backdrop-blur-sm border-b">
            <TimelineEventTrack
              events={timelineEvents}
              timelineWidth={timelineWidth}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              onEventHover={setHoveredEvent}
              onEventClick={(event) => {
                // Find and highlight related synergy block
                const relatedBlock = blocks.find(
                  (b) => b.sinergiaId === event.sinergiaId
                );
                if (relatedBlock && onBlockClick) {
                  onBlockClick(relatedBlock);
                }
                // Also focus on the event date
                setFocusedDate(event.date);
              }}
              selectedEventTypes={
                selectedEventTypes.length > 0 ? selectedEventTypes : undefined
              }
            />
          </div>

          {/* Swim Lanes - Aligned with TimeAxis and EventTrack */}
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

            {/* Highlight connections between events and blocks */}
            {(hoveredEvent || focusedDate) && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left:
                    calculateDatePosition(
                      hoveredEvent?.date || focusedDate!,
                      timelineStart,
                      timelineEnd,
                      timelineWidth
                    ) + LABEL_WIDTH,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  backgroundColor: hoveredEvent
                    ? "var(--color-primary)"
                    : "var(--color-chart-4)",
                  opacity: hoveredEvent ? 0.3 : 0.2,
                  zIndex: 10,
                }}
              />
            )}

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

          {/* Date focus indicator - shows when a date is selected */}
          {focusedDate && (
            <div className="sticky bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
              <div className="bg-popover text-popover-foreground border border-border rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Fecha seleccionada:</span>
                  <span>
                    {format(focusedDate, "dd MMM yyyy", { locale: es })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 pointer-events-auto"
                    onClick={() => {
                      setFocusedDate(null);
                      setSelectedDate(null);
                    }}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
