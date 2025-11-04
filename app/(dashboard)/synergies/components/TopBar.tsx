"use client";

import { useMemo } from "react";
import {
  Network,
  Calendar,
  Filter,
  RotateCcw,
  Download,
  Minimize2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { FilterDropdown } from "./FilterDropdown";
import { DateRangePicker } from "./DateRangePicker";
import { SinergiaDetectada, EstadoSinergia, Criticidad } from "@/types/models";
import { FilterState, ViewState } from "@/types/synergies-viz";

interface TopBarProps {
  view: ViewState["mode"];
  onViewChange: (view: ViewState["mode"]) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sinergias: SinergiaDetectada[];
  onExportPNG?: () => void;
  showMiniMap?: boolean;
  onToggleMiniMap?: () => void;
}

/**
 * Top bar component with view toggle, search, and filters
 */
export function TopBar({
  view,
  onViewChange,
  filters,
  onFiltersChange,
  sinergias,
  onExportPNG,
  showMiniMap,
  onToggleMiniMap,
}: TopBarProps) {
  // Extract unique options for filters
  const estadoOptions = useMemo(() => {
    const estados = new Set<EstadoSinergia>();
    sinergias.forEach((s) => estados.add(s.estado));
    return Array.from(estados).map((estado) => ({
      value: estado,
      label: estado.replace(/_/g, " ").toUpperCase(),
      count: sinergias.filter((s) => s.estado === estado).length,
    }));
  }, [sinergias]);

  const empresaOptions = useMemo(() => {
    const empresas = new Set<string>();
    sinergias.forEach((s) => {
      s.detalle_empresas.forEach((detalle) => empresas.add(detalle.empresa));
    });
    return Array.from(empresas).map((empresa) => ({
      value: empresa,
      label: empresa,
      count: sinergias.filter((s) =>
        s.detalle_empresas.some((detalle) => detalle.empresa === empresa)
      ).length,
    }));
  }, [sinergias]);

  const criticidadOptions = useMemo(() => {
    return Object.values(Criticidad).map((criticidad) => ({
      value: criticidad,
      label: criticidad,
      count: sinergias.filter((s) =>
        s.detalle_empresas.some((detalle) => detalle.criticidad === criticidad)
      ).length,
    }));
  }, [sinergias]);

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      estados: [],
      empresas: [],
      criticidades: [],
      dateRange: [null, null],
      searchQuery: "",
    });
  };

  const hasActiveFilters =
    filters.estados.length > 0 ||
    filters.empresas.length > 0 ||
    filters.criticidades.length > 0 ||
    filters.dateRange[0] !== null ||
    filters.dateRange[1] !== null ||
    filters.searchQuery.trim() !== "";

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-2 sm:space-y-4">
        {/* View Toggle and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <Tabs
            value={view}
            onValueChange={(v) => onViewChange(v as ViewState["mode"])}
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="graph" className="flex-1 sm:flex-initial">
                <Network className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Grafo</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1 sm:flex-initial">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Cronograma</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar
              value={filters.searchQuery}
              onChange={(value) => handleFilterChange("searchQuery", value)}
              sinergias={sinergias}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {onExportPNG && view === "graph" && (
              <Button variant="outline" size="sm" onClick={onExportPNG}>
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>
            )}
            {onToggleMiniMap && view === "graph" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleMiniMap}
                className={showMiniMap ? "bg-accent" : ""}
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                {showMiniMap ? "Ocultar" : "Mostrar"} Mapa
              </Button>
            )}
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <FilterDropdown
            label="Estado"
            icon={<Filter className="h-4 w-4" />}
            options={estadoOptions}
            selectedValues={filters.estados}
            onSelectionChange={(values) =>
              handleFilterChange("estados", values as EstadoSinergia[])
            }
          />

          <FilterDropdown
            label="Empresa"
            icon={<Filter className="h-4 w-4" />}
            options={empresaOptions}
            selectedValues={filters.empresas}
            onSelectionChange={(values) =>
              handleFilterChange("empresas", values)
            }
          />

          <FilterDropdown
            label="Criticidad"
            icon={<Filter className="h-4 w-4" />}
            options={criticidadOptions}
            selectedValues={filters.criticidades}
            onSelectionChange={(values) =>
              handleFilterChange("criticidades", values as Criticidad[])
            }
          />

          <DateRangePicker
            value={filters.dateRange}
            onChange={(range) => handleFilterChange("dateRange", range)}
          />
        </div>
      </div>
    </div>
  );
}
