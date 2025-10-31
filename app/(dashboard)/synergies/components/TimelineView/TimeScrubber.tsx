"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GripVertical } from "lucide-react";

interface TimeScrubberProps {
  currentDate: Date;
  minDate: Date;
  maxDate: Date;
  timelineWidth: number;
  onDateChange: (date: Date) => void;
}

/**
 * Draggable time scrubber for filtering timeline by date
 */
export function TimeScrubber({
  currentDate,
  minDate,
  maxDate,
  timelineWidth,
  onDateChange,
}: TimeScrubberProps) {
  const [isDragging, setIsDragging] = useState(false);

  const totalDays =
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  const daysFromStart =
    (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  const position = (daysFromStart / totalDays) * timelineWidth;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e);
  };

  const handleMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging) return;

    const rect =
      (e.currentTarget as HTMLElement)?.getBoundingClientRect() ||
      document
        .querySelector("[data-timeline-container]")
        ?.getBoundingClientRect();
    if (!rect) return;

    const x = (e as MouseEvent).clientX - rect.left;
    const normalizedX = Math.max(0, Math.min(1, x / timelineWidth));
    const newDaysFromStart = normalizedX * totalDays;
    const newDate = new Date(
      minDate.getTime() + newDaysFromStart * 24 * 60 * 60 * 1000
    );

    onDateChange(newDate);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      className="absolute bottom-4 left-0 right-0 h-12 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 z-40"
      onMouseMove={handleMove}
      data-timeline-container
    >
      {/* Date range background */}
      <div className="relative h-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full"
          style={{ width: timelineWidth }}
        />

        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary cursor-grab active:cursor-grabbing"
          style={{ left: position }}
          onMouseDown={handleMouseDown}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full p-1 shadow-lg">
            <GripVertical className="h-3 w-3 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Date label */}
        <div
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border rounded px-2 py-1 text-xs whitespace-nowrap"
          style={{ left: position }}
        >
          {format(currentDate, "dd MMM yyyy", { locale: es })}
        </div>
      </div>
    </div>
  );
}
