"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
}

/**
 * Date range picker component
 */
export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const clearRange = () => {
    onChange([null, null]);
  };

  const displayText = () => {
    if (!value[0] && !value[1]) return "Seleccionar rango de fechas";
    if (value[0] && !value[1]) {
      return `Desde: ${format(value[0], "dd MMM yyyy", { locale: es })}`;
    }
    if (value[0] && value[1]) {
      return `${format(value[0], "dd MMM", { locale: es })} - ${format(
        value[1],
        "dd MMM yyyy",
        { locale: es }
      )}`;
    }
    return "Seleccionar rango de fechas";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value[0] && !value[1] && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{displayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={
            value[0] || value[1]
              ? {
                  from: value[0] || undefined,
                  to: value[1] || undefined,
                }
              : undefined
          }
          onSelect={(range: { from?: Date; to?: Date } | undefined) => {
            if (!range) {
              onChange([null, null]);
              return;
            }
            if (range.from && !range.to) {
              // Start date selected
              onChange([range.from, null]);
            } else if (range.from && range.to) {
              // Both dates selected
              onChange([range.from, range.to]);
              setOpen(false);
            }
          }}
        />
        {(value[0] || value[1]) && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearRange}
            >
              Limpiar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
