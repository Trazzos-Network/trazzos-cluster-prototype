"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SinergiaDetectada } from "@/types/models";
import {
  transformToGraphData,
  calculateRFPProgress,
  isNewSynergy,
} from "@/lib/synergies/calculations";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  MousePointer2,
} from "lucide-react";
import { FlowingParticles } from "./ForceGraph/FlowingParticles";
import { PulseRing } from "./ForceGraph/PulseRing";
import { ProgressRing } from "./ForceGraph/ProgressRing";
import { RichTooltip } from "./RichTooltip";
import { SynergyDetailPanel } from "./SynergyDetailPanel";
import { MiniMap } from "./MiniMap";
import { BoxSelect } from "./BoxSelect";
import { BottomSheet } from "./BottomSheet";
import { useTouchGestures } from "@/lib/hooks/useTouchGestures";
import { useIsMobile } from "@/hooks/use-mobile";

interface SynergiesGraphProps {
  sinergias: SinergiaDetectada[];
  showMiniMap?: boolean;
  onCompare?: (sinergias: [SinergiaDetectada, SinergiaDetectada]) => void;
}

export function SynergiesGraphEnhanced({
  sinergias,
  showMiniMap = false,
  onCompare,
}: SynergiesGraphProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 1200,
    height: 800,
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedSynergy, setSelectedSynergy] =
    useState<SinergiaDetectada | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [enhancementsEnabled, setEnhancementsEnabled] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [boxSelectEnabled, setBoxSelectEnabled] = useState(false);
  const [viewportPos, setViewportPos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  // Transform data to graph format
  const graphData = useMemo(() => transformToGraphData(sinergias), [sinergias]);

  // Run force simulation
  const { positions } = useForceSimulation(
    graphData.nodes,
    graphData.edges,
    dimensions
  );

  // Update dimensions on resize (responsive for mobile)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        if (isMobile) {
          // Mobile: Use full viewport with aspect ratio
          setDimensions({
            width: width,
            height: Math.max(400, Math.min(600, width * 0.75)),
          });
        } else {
          // Desktop: Standard dimensions
          setDimensions({
            width: width,
            height: Math.max(600, Math.min(800, width * 0.6)),
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile]);

  // Touch gestures for mobile
  const touchGestures = useTouchGestures({
    onPan: (deltaX, deltaY) => {
      if (isMobile) {
        setViewportPos((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
      }
    },
    onZoom: (scale) => {
      if (isMobile) {
        setZoom((prev) => Math.max(0.5, Math.min(3, prev * scale)));
      }
    },
    enabled: isMobile,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // B: Toggle box select
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        setBoxSelectEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(0.75);

  const handleNodeClick = (node: GraphNode, event?: React.MouseEvent) => {
    // Shift + Click: Multi-select or comparison mode
    if (event?.shiftKey && node.type === "synergy") {
      if (selectedNodes.size === 0) {
        // First selection
        setSelectedNodes(new Set([node.id]));
        setSelectedNode(node.id);
      } else if (selectedNodes.size === 1) {
        // Second selection - open comparison
        const firstId = Array.from(selectedNodes)[0];
        const firstNode = graphData.nodes.find((n) => n.id === firstId);
        if (firstNode?.type === "synergy" && onCompare) {
          onCompare([firstNode.data, node.data]);
          setSelectedNodes(new Set());
        }
      } else {
        // Reset and start new selection
        setSelectedNodes(new Set([node.id]));
        setSelectedNode(node.id);
      }
      return;
    }

    // Normal click - navigate to detail page for synergies
    if (node.type === "synergy") {
      router.push(`/synergies/${encodeURIComponent(node.data.id)}`);
      return;
    }

    // For other node types, keep the selection behavior
    if (selectedNodes.has(node.id)) {
      // Deselect if already selected
      setSelectedNodes((prev) => {
        const next = new Set(prev);
        next.delete(node.id);
        return next;
      });
      if (selectedNode === node.id) {
        setSelectedNode(null);
      }
    } else {
      // Single select (clear multi-select)
      setSelectedNode(node.id);
      setSelectedNodes(new Set([node.id]));
    }
  };

  const handleBoxSelect = (selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    // Find all nodes within selection box
    const selected = new Set<string>();
    graphData.nodes.forEach((node) => {
      const pos = positions[node.id];
      if (!pos) return;

      if (
        pos.x >= selection.x &&
        pos.x <= selection.x + selection.width &&
        pos.y >= selection.y &&
        pos.y <= selection.y + selection.height
      ) {
        selected.add(node.id);
      }
    });
    setSelectedNodes(selected);
  };

  return (
    <TooltipProvider delayDuration={250}>
      <div className="space-y-4">
        {/* Controls */}
        <Card>
          <CardContent className="">
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
                  variant={boxSelectEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBoxSelectEnabled(!boxSelectEnabled)}
                  title="Box Select (B)"
                >
                  <MousePointer2 className="h-4 w-4 mr-2" />
                  Seleccionar
                </Button>
                <Button
                  variant={enhancementsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnhancementsEnabled(!enhancementsEnabled)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Efectos
                </Button>
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
              {enhancementsEnabled && " • Efectos mejorados activados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-lg border bg-muted/30 touch-none"
              style={{ height: dimensions.height }}
              {...(isMobile ? touchGestures : {})}
            >
              <svg
                width={dimensions.width}
                height={dimensions.height}
                className="absolute inset-0"
              >
                <defs>
                  {/* Dotted grid pattern */}
                  <pattern
                    id="dottedGrid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="1"
                      cy="1"
                      r="1"
                      fill="var(--color-muted-foreground)"
                      opacity="0.15"
                    />
                  </pattern>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-strong">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background with dotted grid pattern */}
                <rect
                  width="100%"
                  height="100%"
                  fill="var(--color-background)"
                />
                <rect width="100%" height="100%" fill="url(#dottedGrid)" />

                <g
                  transform={`translate(${dimensions.width / 2}, ${
                    dimensions.height / 2
                  }) scale(${zoom}) translate(${-dimensions.width / 2}, ${
                    -dimensions.height / 2
                  })`}
                >
                  {/* Render edges with particles */}
                  {graphData.edges.map((edge) => {
                    const sourcePos = positions[edge.source];
                    const targetPos = positions[edge.target];

                    if (!sourcePos || !targetPos) return null;

                    const edgeColor =
                      edge.type === "company-synergy"
                        ? "var(--color-dataviz-0)"
                        : "var(--color-dataviz-1)";
                    const pathD = `M ${sourcePos.x} ${sourcePos.y} L ${targetPos.x} ${targetPos.y}`;

                    return (
                      <g key={edge.id}>
                        <motion.line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          stroke={edgeColor}
                          strokeWidth={
                            edge.type === "company-synergy"
                              ? Math.sqrt(edge.value / 20) * 2
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
                        {/* Flowing particles for company-synergy edges */}
                        {edge.type === "company-synergy" &&
                          enhancementsEnabled && (
                            <FlowingParticles
                              edgePath={pathD}
                              color={edgeColor}
                              criticidad={edge.criticidad}
                              enabled={enhancementsEnabled}
                            />
                          )}
                      </g>
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
                        isSelected={selectedNodes.has(node.id)}
                        onHover={setHoveredNode}
                        onClick={(e) => handleNodeClick(node, e)}
                        enhancementsEnabled={enhancementsEnabled}
                        isMobile={isMobile}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Box Select */}
              <BoxSelect
                enabled={boxSelectEnabled}
                onSelect={handleBoxSelect}
                onSelectionEnd={() => setBoxSelectEnabled(false)}
                containerRef={containerRef}
              />

              {/* Mini Map - Hidden on mobile or smaller size */}
              {showMiniMap && !isMobile && (
                <MiniMap
                  nodes={graphData.nodes}
                  positions={positions}
                  viewport={{
                    x: viewportPos.x,
                    y: viewportPos.y,
                    width: dimensions.width / zoom,
                    height: dimensions.height / zoom,
                    scale: zoom,
                  }}
                  dimensions={dimensions}
                  onViewportChange={(x, y) => setViewportPos({ x, y })}
                  miniMapSize={isMobile ? 120 : 200}
                />
              )}

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
                      <span className="capitalize">
                        {estado.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhancements indicator */}
              {enhancementsEnabled && (
                <div className="absolute top-4 right-4 bg-primary/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Sparkles className="h-3 w-3" />
                    Efectos Mejorados
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel - Use BottomSheet on mobile, Sheet on desktop */}
        {isMobile ? (
          <BottomSheet
            open={detailPanelOpen && !!selectedSynergy}
            onClose={() => {
              setDetailPanelOpen(false);
              setSelectedSynergy(null);
              setSelectedNode(null);
            }}
            title={selectedSynergy?.insumo}
          >
            {selectedSynergy && (
              <div className="p-4">
                <SynergyDetailPanel
                  synergy={selectedSynergy}
                  open={true}
                  onClose={() => {
                    setDetailPanelOpen(false);
                    setSelectedSynergy(null);
                    setSelectedNode(null);
                  }}
                />
              </div>
            )}
          </BottomSheet>
        ) : (
          <SynergyDetailPanel
            synergy={selectedSynergy}
            open={detailPanelOpen}
            onClose={() => {
              setDetailPanelOpen(false);
              setSelectedSynergy(null);
              setSelectedNode(null);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

// Node Renderer Component with enhancements
function NodeRenderer({
  node,
  position,
  isHovered,
  isSelected,
  onHover,
  onClick,
  enhancementsEnabled,
  isMobile = false,
}: {
  node: GraphNode;
  position: { x: number; y: number };
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (e: React.MouseEvent) => void;
  enhancementsEnabled: boolean;
  isMobile?: boolean;
}) {
  // Increase node sizes for mobile (better touch targets)
  const nodeScale = isMobile ? 1.3 : 1;
  const companyRadius = 45 * nodeScale;
  const synergyRadius =
    node.type === "synergy" ? (node.radius || 40) * nodeScale : 40 * nodeScale;
  const materialRadius = 25 * nodeScale;
  if (node.type === "company") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
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
            onClick={(e) => onClick(e)}
          >
            <circle
              cx={position.x}
              cy={position.y}
              r={companyRadius}
              fill="var(--color-card)"
              stroke={isSelected ? "var(--color-dataviz-1)" : node.color}
              strokeWidth={isSelected ? 3 : 2}
              strokeDasharray={isSelected ? "none" : "8 4"}
              filter={isHovered ? "url(#glow)" : undefined}
            />
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dy="0.35em"
              fontSize="12"
              fontWeight="600"
              fill={isSelected ? "var(--color-dataviz-1)" : node.color}
            >
              {node.name.split(" ")[0]}
            </text>
          </motion.g>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-4">
          <RichTooltip node={node} />
        </TooltipContent>
      </Tooltip>
    );
  }

  if (node.type === "synergy") {
    const hexPath = createHexagonPath(synergyRadius);
    const estado = node.data.estado;
    const isNew = isNewSynergy(node.data.detectada_en);
    const hasRFP = node.data.estado === "en_rfp" && node.data.rfp;
    const rfpProgress = hasRFP ? calculateRFPProgress(node.data.rfp!) : 0;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
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
            onClick={(e) => onClick(e)}
          >
            {/* Pulse effect for new synergies */}
            {isNew && enhancementsEnabled && (
              <PulseRing
                cx={position.x}
                cy={position.y}
                radius={synergyRadius + 10}
                color={ESTADO_COLORS[estado]}
                enabled={enhancementsEnabled}
              />
            )}

            {/* Main hexagon */}
            <path
              d={hexPath}
              transform={`translate(${position.x}, ${position.y})`}
              fill="var(--color-card)"
              stroke={
                isSelected ? "var(--color-dataviz-4)" : ESTADO_COLORS[estado]
              }
              strokeWidth={isSelected ? 3 : estado === "pendiente" ? 2 : 2.5}
              strokeDasharray={
                estado === "pendiente" || estado === "recomendada"
                  ? "6 3"
                  : "none"
              }
              filter={isHovered ? "url(#glow-strong)" : undefined}
            />

            {/* RFP Progress ring */}
            {hasRFP && enhancementsEnabled && (
              <ProgressRing
                cx={position.x}
                cy={position.y}
                radius={node.radius - 5}
                progress={rfpProgress}
                color="var(--color-dataviz-4)"
                strokeWidth={3}
              />
            )}

            {/* Icon */}
            <text
              x={position.x}
              y={position.y - 8}
              textAnchor="middle"
              fontSize="18"
              fill={isSelected ? "var(--color-primary)" : ESTADO_COLORS[estado]}
            >
              🔥
            </text>

            {/* Volume */}
            <text
              x={position.x}
              y={position.y + 12}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={
                isSelected
                  ? "var(--color-primary)"
                  : "var(--color-muted-foreground)"
              }
            >
              {node.data.volumen_total}
            </text>

            {/* Savings badge */}
            <g
              transform={`translate(${position.x + synergyRadius - 15}, ${
                position.y - synergyRadius + 10
              })`}
            >
              <circle
                r="12"
                fill="var(--color-card)"
                fillOpacity="0.85"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dy="0.35em"
                fontSize="8"
                fontWeight="700"
                fill="var(--color-primary)"
              >
                {node.data.ahorro_estimado_pct}%
              </text>
            </g>
          </motion.g>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-4 max-w-md">
          <RichTooltip node={node} />
        </TooltipContent>
      </Tooltip>
    );
  }

  // Material node
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => onHover(node.id)}
          onMouseLeave={() => onHover(null)}
        >
          <circle
            cx={position.x}
            cy={position.y}
            r={materialRadius}
            fill="var(--color-background)"
            stroke={node.color}
            strokeWidth={1.5}
            strokeDasharray="2 2"
          />
          <text
            x={position.x}
            y={position.y}
            textAnchor="middle"
            dy="0.35em"
            fontSize="14"
            fill="var(--color-muted-foreground)"
          >
            {node.icon}
          </text>
        </motion.g>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-4">
        <RichTooltip node={node} />
      </TooltipContent>
    </Tooltip>
  );
}

function createHexagonPath(radius: number): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${radius * Math.cos(angle)},${radius * Math.sin(angle)}`;
  });
  return `M ${points.join(" L ")} Z`;
}
