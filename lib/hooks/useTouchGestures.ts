import { useRef, useState, useCallback } from "react";

interface TouchState {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isDragging: boolean;
}

interface UseTouchGesturesProps {
  onPan?: (deltaX: number, deltaY: number) => void;
  onZoom?: (scale: number, centerX: number, centerY: number) => void;
  onTap?: (x: number, y: number) => void;
  enabled?: boolean;
}

/**
 * Hook for handling touch gestures (pan, zoom, tap)
 */
export function useTouchGestures({
  onPan,
  onZoom,
  onTap,
  enabled = true,
}: UseTouchGesturesProps) {
  const touchStateRef = useRef<TouchState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      if (e.touches.length === 1) {
        // Single touch - potential pan or tap
        const touch = e.touches[0];
        touchStateRef.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          isDragging: false,
        };
      } else if (e.touches.length === 2) {
        // Two touches - pinch zoom
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        touchStateRef.current = {
          startX: (touch1.clientX + touch2.clientX) / 2,
          startY: (touch1.clientY + touch2.clientY) / 2,
          lastX: distance,
          lastY: distance,
          isDragging: true,
        };
      }
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStateRef.current) return;

      if (e.touches.length === 1 && touchStateRef.current) {
        // Single touch move - pan
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStateRef.current.lastX;
        const deltaY = touch.clientY - touchStateRef.current.lastY;

        // Check if movement is significant enough to be considered dragging
        const totalDeltaX = touch.clientX - touchStateRef.current.startX;
        const totalDeltaY = touch.clientY - touchStateRef.current.startY;
        const distance = Math.hypot(totalDeltaX, totalDeltaY);

        if (distance > 10) {
          // Started dragging
          if (!touchStateRef.current.isDragging) {
            touchStateRef.current.isDragging = true;
            setIsDragging(true);
          }

          if (onPan && touchStateRef.current.isDragging) {
            onPan(deltaX, deltaY);
          }
        }

        touchStateRef.current.lastX = touch.clientX;
        touchStateRef.current.lastY = touch.clientY;
      } else if (e.touches.length === 2 && touchStateRef.current) {
        // Two touch move - pinch zoom
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const initialDistance = touchStateRef.current.lastX;
        const scale = distance / initialDistance;

        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        if (onZoom) {
          onZoom(scale, centerX, centerY);
        }

        touchStateRef.current.lastX = distance;
      }
    },
    [enabled, onPan, onZoom]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStateRef.current) return;

      if (e.touches.length === 0) {
        // Touch ended
        const state = touchStateRef.current;
        const totalDeltaX = state.lastX - state.startX;
        const totalDeltaY = state.lastY - state.startY;
        const distance = Math.hypot(totalDeltaX, totalDeltaY);

        // If it was a tap (not a drag)
        if (!state.isDragging && distance < 10 && onTap) {
          onTap(state.lastX, state.lastY);
        }

        touchStateRef.current = null;
        setIsDragging(false);
      }
    },
    [enabled, onTap]
  );

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging,
  };
}
