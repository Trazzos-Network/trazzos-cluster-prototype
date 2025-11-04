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
    const simulationNodes: SimulationNode[] = nodes.map((node, index) => {
      // Better initial positioning - spread nodes in a spiral pattern
      const angle = (index * 2 * Math.PI) / nodes.length;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
      const spiralRadius = radius * (0.5 + (index % 3) * 0.3);
      return {
        ...node,
        x: dimensions.width / 2 + spiralRadius * Math.cos(angle),
        y: dimensions.height / 2 + spiralRadius * Math.sin(angle),
      };
    });
    const simulationLinks: SimulationLink[] = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      value: edge.value,
    }));

    // Scale forces based on graph size to prevent clustering
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const avgConnections = edgeCount / Math.max(nodeCount, 1);

    // Dynamic force scaling
    const chargeStrength = Math.max(-3000, -800 - nodeCount * 15);
    const linkDistance = Math.max(200, 150 + avgConnections * 10);
    const linkStrength = Math.min(0.8, 0.3 + avgConnections * 0.05);
    const collisionPadding = 20;

    // Create force simulation with improved parameters
    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d) => (d as SimulationNode).id)
          .distance((d) => {
            const link = d as unknown as SimulationLink;
            // Scale link distance based on connection type and graph density
            const baseDistance =
              link.type === "company-synergy"
                ? linkDistance
                : linkDistance * 0.6;
            // Add some variance based on edge value to spread nodes
            const valueMultiplier = 1 + Math.log(link.value + 1) * 0.1;
            return baseDistance * valueMultiplier;
          })
          .strength(linkStrength)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(chargeStrength)
          .distanceMax(Math.min(dimensions.width, dimensions.height) * 0.8)
      )
      .force(
        "center",
        d3
          .forceCenter(dimensions.width / 2, dimensions.height / 2)
          .strength(0.1)
      )
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => {
            const node = d as SimulationNode;
            let radius = 40;
            if (node.type === "company") {
              radius = 70 + collisionPadding;
            } else if (node.type === "synergy") {
              radius = ((node as any).radius || 40) + collisionPadding;
            } else {
              radius = 35 + collisionPadding;
            }
            // Scale collision radius based on graph density
            return radius * (1 + Math.log(nodeCount) * 0.1);
          })
          .strength(0.8)
          .iterations(2)
      )
      .force("x", d3.forceX(dimensions.width / 2).strength(0.02))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.02))
      .alphaDecay(0.022)
      .alphaTarget(0.1)
      .velocityDecay(0.4);

    // Restart simulation with higher alpha for better initial positioning
    simulation.alpha(1).restart();

    simulation.on("tick", () => {
      const newPositions: Record<string, Position> = {};
      simulationNodes.forEach((node) => {
        // Keep nodes within bounds
        const padding = 50;
        newPositions[node.id] = {
          x: Math.max(
            padding,
            Math.min(dimensions.width - padding, node.x || dimensions.width / 2)
          ),
          y: Math.max(
            padding,
            Math.min(
              dimensions.height - padding,
              node.y || dimensions.height / 2
            )
          ),
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
