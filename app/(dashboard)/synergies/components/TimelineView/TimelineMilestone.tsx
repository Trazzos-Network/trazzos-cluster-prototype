"use client";

import { motion } from "framer-motion";
import { TimelineEvent } from "@/types/synergies-viz";
import {
  getEventTypeIcon,
  getEventTypeColor,
} from "@/lib/synergies/timeline-events";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineMilestoneProps {
  event: TimelineEvent;
  position: number;
  onHover?: (event: TimelineEvent | null) => void;
  onClick?: (event: TimelineEvent) => void;
}

/**
 * Individual milestone marker on the timeline
 */
export function TimelineMilestone({
  event,
  position,
  onHover,
  onClick,
}: TimelineMilestoneProps) {
  const color = getEventTypeColor(event.type);
  const icon = getEventTypeIcon(event.type);
  const isImportant =
    event.type === "committee_decision" ||
    event.type === "po_emission" ||
    event.type === "rfp_decision";

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer z-20"
            style={{
              left: position,
              top: 0,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.3, zIndex: 30 }}
            onMouseEnter={() => onHover?.(event)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(event)}
          >
            {/* Milestone marker */}
            <div
              className="relative flex items-center justify-center"
              style={{ color }}
            >
              {/* Vertical line */}
              <div
                className="absolute top-0 bottom-0 w-0.5"
                style={{
                  backgroundColor: color,
                  opacity: 0.4,
                  height: "200px", // Extends down to show connection
                }}
              />
              {/* Icon circle */}
              <div
                className="relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shadow-lg"
                style={{
                  backgroundColor: "var(--color-background)",
                  borderColor: color,
                  borderWidth: isImportant ? 3 : 2,
                }}
              >
                <span>{icon}</span>
                {/* Pulse effect for important events */}
                {isImportant && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: color }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-semibold text-sm">{event.label}</div>
            <div className="text-xs text-muted-foreground">
              {format(event.date, "dd MMM yyyy, HH:mm", { locale: es })}
            </div>
            {event.description && (
              <div className="text-xs mt-1">{event.description}</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              {event.insumo}
            </div>
            {event.metadata?.proveedor && (
              <div className="text-xs mt-1">
                Proveedor: {event.metadata.proveedor}
              </div>
            )}
            {event.metadata?.monto && (
              <div className="text-xs mt-1">
                Monto:{" "}
                {event.metadata.monto.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
