"use client";

import { useMemo, useState } from "react";
import { format, startOfMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeAxisProps {
  months: Date[];
  timelineStart: Date;
  timelineEnd: Date;
  width: number;
  scrollLeft: number;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date | null;
  currentDate?: Date;
}

/**
 * Enhanced horizontal time axis with integrated date navigation
 * This is the master reference for all timeline positioning
 */
export function TimeAxis({
  months,
  timelineStart,
  timelineEnd,
  width,
  scrollLeft,
  onDateClick,
  selectedDate,
  currentDate = new Date(),
}: TimeAxisProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Calculate positions for months and add week subdivisions
  const { monthPositions, weekPositions, todayPosition } = useMemo(() => {
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);

    const monthPos = months.map((month) => {
      const monthStart = startOfMonth(month);
      const daysFromStart =
        (monthStart.getTime() - timelineStart.getTime()) /
        (1000 * 60 * 60 * 24);
      const position = (daysFromStart / totalDays) * width;
      return { month, position };
    });

    // Calculate week subdivisions (every 7 days)
    const weekPos: Array<{ date: Date; position: number }> = [];
    let weekDate = new Date(timelineStart);
    while (weekDate <= timelineEnd) {
      const daysFromStart =
        (weekDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
      const position = (daysFromStart / totalDays) * width;
      weekPos.push({ date: new Date(weekDate), position });
      weekDate = new Date(weekDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // Calculate today's position
    const todayDaysFromStart =
      (currentDate.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const todayPos =
      todayDaysFromStart >= 0 && todayDaysFromStart <= totalDays
        ? (todayDaysFromStart / totalDays) * width
        : null;

    return {
      monthPositions: monthPos,
      weekPositions: weekPos,
      todayPosition: todayPos,
    };
  }, [months, timelineStart, timelineEnd, width, currentDate]);

  // Calculate selected date position
  const selectedDatePosition = useMemo(() => {
    if (!selectedDate) return null;
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const daysFromStart =
      (selectedDate.getTime() - timelineStart.getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysFromStart < 0 || daysFromStart > totalDays) return null;
    return (daysFromStart / totalDays) * width;
  }, [selectedDate, timelineStart, timelineEnd, width]);

  const handleAxisClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onDateClick) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollLeft;
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const normalizedX = Math.max(0, Math.min(1, x / width));
    const daysFromStart = normalizedX * totalDays;
    const clickedDate = new Date(
      timelineStart.getTime() + daysFromStart * 24 * 60 * 60 * 1000
    );

    onDateClick(clickedDate);
  };

  return (
    <TooltipProvider>
      <div
        className="relative bg-background border-b border-border"
        style={{ height: 80 }}
      >
        {/* Label area */}
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-xs font-medium text-muted-foreground border-r pr-2"
          style={{ width: 200 }}
        >
          Tiempo
        </div>

        {/* Timeline axis */}
        <div
          className="absolute left-0 right-0 top-0 bottom-0"
          style={{ paddingLeft: 200 }}
        >
          <svg
            width={width}
            height={80}
            className="block cursor-pointer"
            onClick={handleAxisClick}
            onMouseMove={(e) => {
              if (!onDateClick) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left + scrollLeft;
              const totalDays =
                (timelineEnd.getTime() - timelineStart.getTime()) /
                (1000 * 60 * 60 * 24);
              const normalizedX = Math.max(0, Math.min(1, x / width));
              const daysFromStart = normalizedX * totalDays;
              const hoverDate = new Date(
                timelineStart.getTime() + daysFromStart * 24 * 60 * 60 * 1000
              );
              setHoveredDate(hoverDate);
            }}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {/* Background grid */}
            <defs>
              <pattern
                id="timeGrid"
                width="1"
                height="1"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="1"
                  height="80"
                  fill="var(--color-border)"
                  opacity="0.1"
                />
              </pattern>
            </defs>

            {/* Week subdivision lines (subtle) */}
            {weekPositions.map(({ position }, index) => (
              <line
                key={`week-${index}`}
                x1={position}
                y1={0}
                x2={position}
                y2={80}
                stroke="var(--color-border)"
                strokeWidth={0.5}
                opacity={0.3}
                strokeDasharray="2 2"
              />
            ))}

            {/* Today indicator */}
            {todayPosition !== null && (
              <g>
                <line
                  x1={todayPosition}
                  y1={0}
                  x2={todayPosition}
                  y2={80}
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  opacity={0.8}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.circle
                      cx={todayPosition}
                      cy={10}
                      r={6}
                      fill="var(--color-primary)"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm font-medium">Hoy</div>
                    <div className="text-xs text-muted-foreground">
                      {format(currentDate, "dd MMM yyyy", { locale: es })}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </g>
            )}

            {/* Selected date indicator */}
            {selectedDatePosition !== null &&
              selectedDate &&
              !isSameDay(selectedDate, currentDate) && (
                <g>
                  <line
                    x1={selectedDatePosition}
                    y1={0}
                    x2={selectedDatePosition}
                    y2={80}
                    stroke="var(--color-chart-4)"
                    strokeWidth={2}
                    opacity={0.6}
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={selectedDatePosition}
                    cy={15}
                    r={5}
                    fill="var(--color-chart-4)"
                    className="cursor-pointer"
                  />
                </g>
              )}

            {/* Hovered date indicator */}
            {hoveredDate && (
              <g>
                <line
                  x1={
                    ((hoveredDate.getTime() - timelineStart.getTime()) /
                      (timelineEnd.getTime() - timelineStart.getTime())) *
                    width
                  }
                  y1={0}
                  x2={
                    ((hoveredDate.getTime() - timelineStart.getTime()) /
                      (timelineEnd.getTime() - timelineStart.getTime())) *
                    width
                  }
                  y2={80}
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1}
                  opacity={0.5}
                />
              </g>
            )}

            {/* Month labels */}
            {monthPositions.map(({ month, position }, index) => (
              <g key={format(month, "yyyy-MM")}>
                {/* Vertical line for month */}
                <line
                  x1={position}
                  y1={0}
                  x2={position}
                  y2={80}
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                />
                {/* Month label */}
                <text
                  x={position + 5}
                  y={30}
                  fontSize="12"
                  fontWeight="600"
                  fill="var(--color-foreground)"
                >
                  {format(month, "MMM", { locale: es }).toUpperCase()}
                </text>
                {/* Year label (only when year changes) */}
                {index === 0 ||
                format(month, "yyyy") !== format(months[index - 1]!, "yyyy") ? (
                  <text
                    x={position + 5}
                    y={50}
                    fontSize="10"
                    fill="var(--color-muted-foreground)"
                  >
                    {format(month, "yyyy")}
                  </text>
                ) : null}
              </g>
            ))}

            {/* Hover tooltip */}
            {hoveredDate && (
              <foreignObject
                x={
                  ((hoveredDate.getTime() - timelineStart.getTime()) /
                    (timelineEnd.getTime() - timelineStart.getTime())) *
                    width -
                  50
                }
                y={60}
                width={100}
                height={20}
              >
                <div className="text-center text-[10px] text-muted-foreground bg-background/90 px-2 py-1 rounded">
                  {format(hoveredDate, "dd MMM", { locale: es })}
                </div>
              </foreignObject>
            )}
          </svg>

          {/* Click hint */}
          {onDateClick && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span>📅 Click en el eje para seleccionar fecha</span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
