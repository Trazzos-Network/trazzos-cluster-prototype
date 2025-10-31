"use client";

import { useMemo } from "react";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

interface TimeAxisProps {
  months: Date[];
  timelineStart: Date;
  timelineEnd: Date;
  width: number;
  scrollLeft: number;
}

/**
 * Horizontal time axis showing months
 */
export function TimeAxis({
  months,
  timelineStart,
  timelineEnd,
  width,
  scrollLeft,
}: TimeAxisProps) {
  const monthPositions = useMemo(() => {
    const totalDays =
      (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const daysFromStart =
        (monthStart.getTime() - timelineStart.getTime()) /
        (1000 * 60 * 60 * 24);
      const position = (daysFromStart / totalDays) * width;
      return { month, position };
    });
  }, [months, timelineStart, timelineEnd, width]);

  return (
    <div
      className="sticky top-0 z-10 bg-background border-b border-border"
      style={{ transform: `translateX(-${scrollLeft}px)` }}
    >
      <svg width={width} height={60} className="block">
        {/* Month labels */}
        {monthPositions.map(({ month, position }, index) => (
          <g key={format(month, "yyyy-MM")}>
            {/* Vertical line */}
            <line
              x1={position}
              y1={0}
              x2={position}
              y2={60}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            {/* Month label */}
            <text
              x={position + 5}
              y={25}
              fontSize="12"
              fontWeight="600"
              fill="var(--color-foreground)"
            >
              {format(month, "MMM", { locale: es }).toUpperCase()}
            </text>
            {/* Year label */}
            {index === 0 ||
            format(month, "yyyy") !== format(months[index - 1]!, "yyyy") ? (
              <text
                x={position + 5}
                y={45}
                fontSize="10"
                fill="var(--color-muted-foreground)"
              >
                {format(month, "yyyy")}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
