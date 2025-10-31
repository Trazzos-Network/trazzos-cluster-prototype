import { useEffect, useState } from "react";
import * as d3 from "d3";
import {
  GraphNode,
  GraphEdge,
  Position,
  Dimensions,
} from "@/types/synergies-viz";

// Type for D3 simulation nodes (GraphNode with added D3 properties)
type SimulationNode = GraphNode & {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

// Type for D3 simulation links
interface SimulationLink {
  source: string;
  target: string;
  type: string;
  value: number;
}

interface UseForceSimulationResult {
  positions: Record<string, Position>;
}

export function useForceSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  dimensions: Dimensions
): UseForceSimulationResult {
  const [positions, setPositions] = useState<Record<string, Position>>({});

  useEffect(() => {
    if (!nodes.length || !dimensions.width || !dimensions.height) return;

    // Create a copy of nodes for D3 to mutate
    const simulationNodes: SimulationNode[] = nodes.map((node) => ({
      ...node,
    }));
    const simulationLinks: SimulationLink[] = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      value: edge.value,
    }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d) => (d as SimulationNode).id)
          .distance((d) => {
            // Longer links for company-synergy connections
            const link = d as unknown as SimulationLink;
            return link.type === "company-synergy" ? 150 : 80;
          })
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          const node = d as SimulationNode;
          if (node.type === "company") return 60;
          if (node.type === "synergy") return (node.radius || 40) + 10;
          return 30;
        })
      )
      .force("x", d3.forceX(dimensions.width / 2).strength(0.05))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.05))
      .alphaDecay(0.02);

    simulation.on("tick", () => {
      const newPositions: Record<string, Position> = {};
      simulationNodes.forEach((node) => {
        newPositions[node.id] = {
          x: node.x || 0,
          y: node.y || 0,
        };
      });
      setPositions(newPositions);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions.width, dimensions.height]);

  return {
    positions,
  };
}
