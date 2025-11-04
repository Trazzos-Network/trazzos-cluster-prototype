"use client";

import { useState, useEffect } from "react";
import { Position } from "@/types/synergies-viz";

interface BoxSelectProps {
  enabled: boolean;
  onSelect: (selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  onSelectionEnd: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Box selection component for multi-select on graph
 */
export function BoxSelect({
  enabled,
  onSelect,
  onSelectionEnd,
  containerRef,
}: BoxSelectProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentPos, setCurrentPos] = useState<Position | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only start selection if clicking on empty space (not on a node)
      if (e.target instanceof SVGElement || e.target instanceof HTMLElement) {
        const target = e.target as HTMLElement;
        // Check if clicking on a node or edge
        if (
          target.closest("[data-node-id]") ||
          target.closest("[data-edge-id]")
        ) {
          return;
        }
      }

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsSelecting(true);
      setStartPos({ x, y });
      setCurrentPos({ x, y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting || !startPos || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCurrentPos({ x, y });
    };

    const handleMouseUp = () => {
      if (!isSelecting || !startPos || !currentPos) return;

      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);

      // Only trigger selection if box is large enough (avoid accidental clicks)
      if (width > 5 && height > 5) {
        const selection = {
          x: Math.min(startPos.x, currentPos.x),
          y: Math.min(startPos.y, currentPos.y),
          width,
          height,
        };
        onSelect(selection);
      }

      setIsSelecting(false);
      setStartPos(null);
      setCurrentPos(null);
      onSelectionEnd();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    enabled,
    isSelecting,
    startPos,
    currentPos,
    onSelect,
    onSelectionEnd,
    containerRef,
  ]);

  if (!isSelecting || !startPos || !currentPos) return null;

  const x = Math.min(startPos.x, currentPos.x);
  const y = Math.min(startPos.y, currentPos.y);
  const width = Math.abs(currentPos.x - startPos.x);
  const height = Math.abs(currentPos.y - startPos.y);

  return (
    <div
      className="absolute border-2 border-primary bg-primary/10 pointer-events-none z-40"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
}
