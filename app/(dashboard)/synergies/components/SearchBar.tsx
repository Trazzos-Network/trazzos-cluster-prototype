"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SinergiaDetectada } from "@/types/models";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  sinergias: SinergiaDetectada[];
  placeholder?: string;
}

/**
 * Search bar with autocomplete suggestions
 */
export function SearchBar({
  value,
  onChange,
  sinergias,
  placeholder = "Buscar sinergias, empresas, materiales...",
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate searchable items
  const searchableItems = useMemo(
    () =>
      sinergias.flatMap((sinergia) => [
        {
          type: "sinergia" as const,
          label: `${sinergia.insumo} (${sinergia.id})`,
          id: sinergia.id,
        },
        ...sinergia.detalle_empresas.map((detalle) => ({
          type: "empresa" as const,
          label: detalle.empresa,
          id: `${sinergia.id}-${detalle.empresa}`,
        })),
        {
          type: "material" as const,
          label: sinergia.insumo,
          id: `${sinergia.id}-material`,
        },
      ]),
    [sinergias]
  );

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!value.trim()) {
      return [];
    }

    const query = value.toLowerCase();
    return searchableItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 results
  }, [value, searchableItems]);

  // Update open state based on filtered results
  // Use controlled open state from parent instead of managing in effect
  const shouldBeOpen = useMemo(() => {
    return value.trim() && filteredResults.length > 0;
  }, [value, filteredResults.length]);

  // Sync open state when search results change
  if (shouldBeOpen && !open && value.trim()) {
    setOpen(true);
  } else if (!value.trim() && open) {
    setOpen(false);
  }

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-9"
            onFocus={() => value.trim() && setOpen(true)}
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." value={value} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {filteredResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.label}
                  onSelect={() => handleSelect(result.label)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {result.type === "sinergia"
                        ? "🔗"
                        : result.type === "empresa"
                        ? "🏢"
                        : "📦"}
                    </span>
                    <span>{result.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
