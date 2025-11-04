import { useMemo } from "react";
import { SinergiaDetectada } from "@/types/models";
import { FilterState } from "@/types/synergies-viz";
import { GraphNode, GraphEdge } from "@/types/synergies-viz";

interface UseGraphFiltersProps {
  sinergias: SinergiaDetectada[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  filters: FilterState;
}

interface FilteredData {
  sinergias: SinergiaDetectada[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Hook to filter synergies and graph data based on filter state
 */
export function useGraphFilters({
  sinergias,
  nodes,
  edges,
  filters,
}: UseGraphFiltersProps): FilteredData {
  return useMemo(() => {
    let filteredSinergias = [...sinergias];

    // Filter by estados
    if (filters.estados.length > 0) {
      filteredSinergias = filteredSinergias.filter((s) =>
        filters.estados.includes(s.estado)
      );
    }

    // Filter by empresas
    if (filters.empresas.length > 0) {
      filteredSinergias = filteredSinergias.filter((s) =>
        s.detalle_empresas.some((detalle) =>
          filters.empresas.includes(detalle.empresa)
        )
      );
    }

    // Filter by criticidades
    if (filters.criticidades.length > 0) {
      filteredSinergias = filteredSinergias.filter((s) =>
        s.detalle_empresas.some((detalle) =>
          filters.criticidades.includes(detalle.criticidad)
        )
      );
    }

    // Filter by date range
    if (filters.dateRange[0] || filters.dateRange[1]) {
      filteredSinergias = filteredSinergias.filter((s) => {
        const [start, end] = s.ventana;
        if (filters.dateRange[0] && end < filters.dateRange[0]) return false;
        if (filters.dateRange[1] && start > filters.dateRange[1]) return false;
        return true;
      });
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filteredSinergias = filteredSinergias.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          s.insumo.toLowerCase().includes(query) ||
          s.detalle_empresas.some((detalle) =>
            detalle.empresa.toLowerCase().includes(query)
          )
      );
    }

    // Get IDs of filtered synergies
    const filteredSinergiaIds = new Set(filteredSinergias.map((s) => s.id));

    // Filter nodes based on filtered synergies
    const filteredNodes = nodes.filter((node) => {
      if (node.type === "synergy") {
        return filteredSinergiaIds.has(node.data.id);
      } else if (node.type === "company") {
        // Keep company if it has at least one filtered synergy
        return filteredSinergias.some((s) =>
          s.detalle_empresas.some((detalle) => detalle.empresa === node.name)
        );
      } else if (node.type === "material") {
        // Keep material if it has at least one filtered synergy
        return filteredSinergias.some((s) =>
          s.insumo.toLowerCase().includes(node.category.toLowerCase())
        );
      }
      return true;
    });

    // Filter edges to only include connections between filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = edges.filter(
      (edge) =>
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );

    return {
      sinergias: filteredSinergias,
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }, [sinergias, nodes, edges, filters]);
}
