"use client";

import { useState, useRef } from "react";
import { SAMPLE_OUTPUT } from "@/data/sample_data";
import { SynergiesGraphEnhanced } from "./components/SynergiesGraphEnhanced";
import { TimelineView } from "./components/TimelineView";
import { TopBar } from "./components/TopBar";
import { ComparisonPanel } from "./components/ComparisonPanel";
import { FilterState, ViewState } from "@/types/synergies-viz";
import { SinergiaDetectada } from "@/types/models";
import { exportSVGAsPNG } from "@/lib/utils/export-utils";

export default function SynergiesPage() {
  const allSinergias = SAMPLE_OUTPUT.sinergias;
  const [view, setView] = useState<ViewState["mode"]>("graph");
  const [filters, setFilters] = useState<FilterState>({
    estados: [],
    empresas: [],
    criticidades: [],
    dateRange: [null, null],
    searchQuery: "",
  });
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [comparisonSinergias, setComparisonSinergias] = useState<
    [SinergiaDetectada, SinergiaDetectada] | null
  >(null);
  const graphRef = useRef<HTMLDivElement>(null);

  // Simple filter logic for now (full integration with useGraphFilters would need graph data)
  const filteredSinergias = allSinergias.filter((sinergia) => {
    // Filter by estados
    if (
      filters.estados.length > 0 &&
      !filters.estados.includes(sinergia.estado)
    ) {
      return false;
    }

    // Filter by empresas
    if (filters.empresas.length > 0) {
      const hasMatchingEmpresa = sinergia.detalle_empresas.some((detalle) =>
        filters.empresas.includes(detalle.empresa)
      );
      if (!hasMatchingEmpresa) return false;
    }

    // Filter by criticidades
    if (filters.criticidades.length > 0) {
      const hasMatchingCriticidad = sinergia.detalle_empresas.some((detalle) =>
        filters.criticidades.includes(detalle.criticidad)
      );
      if (!hasMatchingCriticidad) return false;
    }

    // Filter by date range
    if (filters.dateRange[0] || filters.dateRange[1]) {
      const [start, end] = sinergia.ventana;
      if (filters.dateRange[0] && end < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && start > filters.dateRange[1]) return false;
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const matchesId = sinergia.id.toLowerCase().includes(query);
      const matchesInsumo = sinergia.insumo.toLowerCase().includes(query);
      const matchesEmpresa = sinergia.detalle_empresas.some((detalle) =>
        detalle.empresa.toLowerCase().includes(query)
      );
      if (!matchesId && !matchesInsumo && !matchesEmpresa) return false;
    }

    return true;
  });

  const handleExportPNG = async () => {
    if (!graphRef.current) return;

    const svg = graphRef.current.querySelector("svg");
    if (!svg) return;

    try {
      await exportSVGAsPNG(
        svg,
        `sinergias-${new Date().toISOString().split("T")[0]}.png`,
        {
          scale: 2,
        }
      );
    } catch (error) {
      console.error("Failed to export PNG:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        sinergias={allSinergias}
        onExportPNG={view === "graph" ? handleExportPNG : undefined}
        showMiniMap={showMiniMap}
        onToggleMiniMap={
          view === "graph" ? () => setShowMiniMap(!showMiniMap) : undefined
        }
      />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Visualización de Sinergias
          </h1>
          <p className="text-muted-foreground mt-2">
            Red de colaboración entre empresas del clúster petroquímico
          </p>
        </div>
        <div ref={graphRef}>
          {view === "graph" ? (
            <SynergiesGraphEnhanced
              sinergias={filteredSinergias}
              showMiniMap={showMiniMap}
              onCompare={(sinergias) => setComparisonSinergias(sinergias)}
            />
          ) : (
            <TimelineView sinergias={filteredSinergias} />
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      {comparisonSinergias && (
        <ComparisonPanel
          sinergias={comparisonSinergias}
          onClose={() => setComparisonSinergias(null)}
        />
      )}
    </div>
  );
}
