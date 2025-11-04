"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SinergiaDetectada } from "@/types/models";
import {
  TimelineBlock,
  TimelineEvent,
  TimelineEventType,
} from "@/types/synergies-viz";
import {
  transformToTimelineBlocks,
  groupBlocksByCompany,
  getTimelineDateRangeFromData,
  calculateDatePosition,
  extractMaintenancePeriods,
} from "@/lib/synergies/timeline-utils";
import {
  extractAllTimelineEvents,
  getEventTypeIcon,
} from "@/lib/synergies/timeline-events";
import { TimeAxis } from "./TimeAxis";
import { SwimLane } from "./SwimLane";
// Removed OverlapIndicator - replaced with maintenance period blocks
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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
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
    return Array.from(types) as TimelineEventType[];
  }, [timelineEvents]);

  // Calculate timeline date range from actual data (exactly 12 months)
  const {
    start: timelineStart,
    end: timelineEnd,
    months,
  } = useMemo(
    () => getTimelineDateRangeFromData(blocks, timelineEvents),
    [blocks, timelineEvents]
  );

  // Extract maintenance periods per company
  const maintenancePeriodsByCompany = useMemo(
    () => extractMaintenancePeriods(blocks),
    [blocks]
  );

  // Update timeline width to match container width (no overflow)
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        // Timeline width = container width - label width (200px)
        setTimelineWidth(containerWidth - LABEL_WIDTH);
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

  // Handle block click - navigate to detail page
  const handleBlockClick = (block: TimelineBlock) => {
    router.push(`/synergies/${encodeURIComponent(block.sinergiaId)}`);
    if (onBlockClick) {
      onBlockClick(block);
    }
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
                            {getEventTypeIcon(eventType)}
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
          className="relative w-full overflow-y-auto overflow-x-hidden"
          style={{ height: "calc(100vh - 300px)", minHeight: 600 }}
        >
          {/* Time Axis - Master reference for all timeline positioning */}
          <div className="sticky top-0 z-20 bg-background border-b">
            <TimeAxis
              months={months}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              width={timelineWidth}
              onDateClick={(date) => {
                setFocusedDate(date);
                setSelectedDate(date);
              }}
              selectedDate={focusedDate || selectedDate}
            />
          </div>

          {/* Event Track - Aligned with TimeAxis */}
          <div
            className="sticky top-[80px] z-10 bg-background border-b"
            style={{ height: EVENT_TRACK_HEIGHT }}
          >
            <TimelineEventTrack
              events={timelineEvents}
              timelineWidth={timelineWidth}
              timelineStart={timelineStart}
              timelineEnd={timelineEnd}
              onEventHover={setHoveredEvent}
              onEventClick={(event) => {
                // Navigate to synergy detail page
                router.push(
                  `/synergies/${encodeURIComponent(event.sinergiaId)}`
                );
                // Also focus on the event date
                setFocusedDate(event.date);
              }}
              selectedEventTypes={
                selectedEventTypes.length > 0 ? selectedEventTypes : undefined
              }
            />
          </div>

          {/* Swim Lanes - Aligned with TimeAxis and EventTrack */}
          <div
            className="relative"
            style={{ minHeight: totalHeight, marginTop: EVENT_TRACK_HEIGHT }}
          >
            {filteredSwimLanes.map((lane) => {
              const maintenancePeriods =
                maintenancePeriodsByCompany.get(lane.empresa) || [];
              const periodsWithIds = maintenancePeriods.map((period, idx) => ({
                id: `maintenance-${lane.empresa}-${idx}`,
                ...period,
              }));

              return (
                <SwimLane
                  key={lane.empresa}
                  empresa={lane.empresa}
                  blocks={lane.blocks}
                  maintenancePeriods={periodsWithIds}
                  color={lane.color}
                  laneHeight={LANE_HEIGHT}
                  timelineStart={timelineStart}
                  timelineEnd={timelineEnd}
                  timelineWidth={timelineWidth}
                  scrollLeft={0}
                  onBlockClick={handleBlockClick}
                  onBlockHover={() => {}}
                />
              );
            })}

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

            {/* Maintenance periods are now shown as horizontal blocks in each swim lane */}
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
