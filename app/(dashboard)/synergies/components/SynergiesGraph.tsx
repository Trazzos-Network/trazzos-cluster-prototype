"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SinergiaDetectada } from "@/types/models";
import { transformToGraphData } from "@/lib/synergies/calculations";
import { useForceSimulation } from "@/lib/hooks/useForceSimulation";
import { GraphNode, Dimensions, ESTADO_COLORS } from "@/types/synergies-viz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface SynergiesGraphProps {
  sinergias: SinergiaDetectada[];
}

export function SynergiesGraph({ sinergias }: SynergiesGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 1200,
    height: 800,
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Transform data to graph format
  const graphData = useMemo(() => transformToGraphData(sinergias), [sinergias]);

  // Run force simulation
  const { positions } = useForceSimulation(
    graphData.nodes,
    graphData.edges,
    dimensions
  );

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: Math.max(600, Math.min(800, width * 0.6)),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {graphData.nodes.filter((n) => n.type === "synergy").length}{" "}
                Sinergias
              </Badge>
              <Badge variant="outline">
                {graphData.nodes.filter((n) => n.type === "company").length}{" "}
                Empresas
              </Badge>
              <Badge variant="outline">
                {graphData.edges.length} Conexiones
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleResetZoom}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graph Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Red de Sinergias</CardTitle>
          <CardDescription>
            Visualización interactiva de oportunidades de compra conjunta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg border bg-muted/30"
            style={{ height: dimensions.height }}
          >
            <svg
              width={dimensions.width}
              height={dimensions.height}
              className="absolute inset-0"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                transform={`translate(${dimensions.width / 2}, ${
                  dimensions.height / 2
                }) scale(${zoom}) translate(${-dimensions.width / 2}, ${
                  -dimensions.height / 2
                })`}
              >
                {/* Render edges */}
                {graphData.edges.map((edge) => {
                  const sourcePos = positions[edge.source];
                  const targetPos = positions[edge.target];

                  if (!sourcePos || !targetPos) return null;

                  return (
                    <motion.line
                      key={edge.id}
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={
                        edge.type === "company-synergy" ? "#3b82f6" : "#9ca3af"
                      }
                      strokeWidth={
                        edge.type === "company-synergy"
                          ? Math.sqrt(edge.value) * 2
                          : 1
                      }
                      strokeOpacity={0.6}
                      strokeDasharray={
                        edge.type === "synergy-material" ? "4,4" : "none"
                      }
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  );
                })}

                {/* Render nodes */}
                {graphData.nodes.map((node) => {
                  const pos = positions[node.id];
                  if (!pos) return null;

                  return (
                    <NodeRenderer
                      key={node.id}
                      node={node}
                      position={pos}
                      isHovered={hoveredNode === node.id}
                      isSelected={selectedNode === node.id}
                      onHover={setHoveredNode}
                      onClick={setSelectedNode}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
              <div className="text-sm font-medium mb-2">Estados</div>
              <div className="space-y-1 text-xs">
                {Object.entries(ESTADO_COLORS).map(([estado, color]) => (
                  <div key={estado} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span>{estado.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Nodo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nodo seleccionado: {selectedNode}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Node Renderer Component
function NodeRenderer({
  node,
  position,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: {
  node: GraphNode;
  position: { x: number; y: number };
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  if (node.type === "company") {
    return (
      <motion.g
        style={{ cursor: "pointer" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.15 : isSelected ? 1.1 : 1,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(node.id)}
      >
        <circle
          cx={position.x}
          cy={position.y}
          r={45}
          fill={node.color}
          stroke={isSelected ? "#3b82f6" : "#fff"}
          strokeWidth={isSelected ? 4 : 2}
          filter={isHovered ? "url(#glow)" : undefined}
        />
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dy="0.35em"
          fontSize="12"
          fontWeight="600"
          fill="white"
        >
          {node.name.split(" ")[0]}
        </text>
      </motion.g>
    );
  }

  if (node.type === "synergy") {
    const hexPath = createHexagonPath(node.radius);
    const estado = node.data.estado;

    return (
      <motion.g
        style={{ cursor: "pointer" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1.15 : isSelected ? 1.1 : 1,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(node.id)}
      >
        <path
          d={hexPath}
          transform={`translate(${position.x}, ${position.y})`}
          fill={ESTADO_COLORS[estado]}
          stroke={isSelected ? "#3b82f6" : "#fff"}
          strokeWidth={isSelected ? 3 : 1.5}
          filter={isHovered ? "url(#glow)" : undefined}
        />
        <text
          x={position.x}
          y={position.y - 8}
          textAnchor="middle"
          fontSize="18"
          fill="white"
        >
          🔥
        </text>
        <text
          x={position.x}
          y={position.y + 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="white"
        >
          {node.data.volumen_total}
        </text>
      </motion.g>
    );
  }

  // Material node
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <circle
        cx={position.x}
        cy={position.y}
        r={20}
        fill={node.color}
        stroke="#fff"
        strokeWidth={1}
      />
      <text
        x={position.x}
        y={position.y}
        textAnchor="middle"
        dy="0.35em"
        fontSize="14"
      >
        {node.icon}
      </text>
    </motion.g>
  );
}

function createHexagonPath(radius: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  });
  return `M ${points.join(" L ")} Z`;
}
