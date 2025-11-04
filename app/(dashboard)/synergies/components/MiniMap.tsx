"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { GraphNode, Position } from "@/types/synergies-viz";
import { motion } from "framer-motion";

interface MiniMapProps {
  nodes: GraphNode[];
  positions: Record<string, Position>;
  viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  onViewportChange: (x: number, y: number) => void;
  miniMapSize?: number;
}

/**
 * Mini-map component showing overview of graph with viewport indicator
 */
export function MiniMap({
  nodes,
  positions,
  viewport,
  dimensions: _dimensions, // eslint-disable-line @typescript-eslint/no-unused-vars
  onViewportChange,
  miniMapSize = 200,
}: MiniMapProps) {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate bounds of all nodes
  const bounds = useMemo(() => {
    if (Object.keys(positions).length === 0) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    }

    const allPositions = Object.values(positions);
    const xs = allPositions.map((p) => p.x);
    const ys = allPositions.map((p) => p.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [positions]);

  const contentWidth = bounds.maxX - bounds.minX || 1;
  const contentHeight = bounds.maxY - bounds.minY || 1;
  const aspectRatio = contentWidth / contentHeight;

  // Calculate mini-map dimensions maintaining aspect ratio
  const mapWidth = aspectRatio > 1 ? miniMapSize : miniMapSize * aspectRatio;
  const mapHeight = aspectRatio > 1 ? miniMapSize / aspectRatio : miniMapSize;

  // Scale to fit mini-map
  const scaleX = mapWidth / contentWidth;
  const scaleY = mapHeight / contentHeight;
  const scale = Math.min(scaleX, scaleY);

  // Convert positions to mini-map coordinates
  const nodePositions = useMemo(() => {
    return Object.entries(positions).map(([id, pos]) => ({
      id,
      x: (pos.x - bounds.minX) * scale,
      y: (pos.y - bounds.minY) * scale,
      node: nodes.find((n) => n.id === id),
    }));
  }, [positions, bounds, scale, nodes]);

  // Calculate viewport rectangle in mini-map coordinates
  const viewportRect = useMemo(() => {
    const viewportX = (viewport.x - bounds.minX) * scale;
    const viewportY = (viewport.y - bounds.minY) * scale;
    const viewportWidth = viewport.width * scale;
    const viewportHeight = viewport.height * scale;

    return {
      x: viewportX,
      y: viewportY,
      width: Math.min(viewportWidth, mapWidth),
      height: Math.min(viewportHeight, mapHeight),
    };
  }, [viewport, bounds, scale, mapWidth, mapHeight]);

  const handleMiniMapClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      if (!miniMapRef.current) return;

      const rect = miniMapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert mini-map coordinates back to main view coordinates
      const mainX = x / scale + bounds.minX - viewport.width / 2;
      const mainY = y / scale + bounds.minY - viewport.height / 2;

      onViewportChange(mainX, mainY);
    },
    [scale, bounds, viewport, onViewportChange]
  );

  const handleViewportDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const rect = miniMapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - viewportRect.width / 2;
      const y = e.clientY - rect.top - viewportRect.height / 2;

      const clampedX = Math.max(0, Math.min(x, mapWidth - viewportRect.width));
      const clampedY = Math.max(
        0,
        Math.min(y, mapHeight - viewportRect.height)
      );

      const mainX = clampedX / scale + bounds.minX - viewport.width / 2;
      const mainY = clampedY / scale + bounds.minY - viewport.height / 2;

      onViewportChange(mainX, mainY);
    },
    [
      isDragging,
      scale,
      bounds,
      viewport,
      viewportRect,
      mapWidth,
      mapHeight,
      onViewportChange,
    ]
  );

  return (
    <div
      ref={miniMapRef}
      className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg z-50"
      style={{ width: mapWidth + 16, height: mapHeight + 16 }}
    >
      <div className="text-xs font-semibold mb-1 text-muted-foreground">
        Vista General
      </div>
      <svg
        width={mapWidth}
        height={mapHeight}
        className="cursor-pointer"
        onClick={handleMiniMapClick}
      >
        {/* Background */}
        <rect
          width={mapWidth}
          height={mapHeight}
          fill="var(--color-muted)"
          rx={4}
        />

        {/* Edges (simplified lines) */}
        {nodePositions.map((node, i) => {
          if (i === 0) return null;
          const prevNode = nodePositions[i - 1];
          return (
            <line
              key={`edge-${prevNode.id}-${node.id}`}
              x1={prevNode.x}
              y1={prevNode.y}
              x2={node.x}
              y2={node.y}
              stroke="var(--color-muted-foreground)"
              strokeWidth={0.5}
              opacity={0.3}
            />
          );
        })}

        {/* Nodes */}
        {nodePositions.map(({ id, x, y, node }) => {
          if (!node) return null;
          const size =
            node.type === "company" ? 4 : node.type === "synergy" ? 3 : 2;
          return (
            <circle
              key={id}
              cx={x}
              cy={y}
              r={size}
              fill={
                node.type === "company"
                  ? "var(--color-chart-1)"
                  : node.type === "synergy"
                  ? "var(--color-chart-2)"
                  : "var(--color-chart-3)"
              }
            />
          );
        })}

        {/* Viewport indicator */}
        <motion.rect
          x={viewportRect.x}
          y={viewportRect.y}
          width={viewportRect.width}
          height={viewportRect.height}
          fill="var(--color-primary)"
          fillOpacity={0.2}
          stroke="var(--color-primary)"
          strokeWidth={1.5}
          rx={2}
          initial={false}
          animate={{
            x: viewportRect.x,
            y: viewportRect.y,
            width: viewportRect.width,
            height: viewportRect.height,
          }}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleViewportDrag}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className="cursor-move"
        />
      </svg>
    </div>
  );
}
