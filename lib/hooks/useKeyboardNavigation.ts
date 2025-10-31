import { useEffect, useRef } from "react";

interface UseKeyboardNavigationProps {
  enabled: boolean;
  itemCount: number;
  onSelect: (index: number) => void;
  onFocus?: (index: number) => void;
}

/**
 * Hook for keyboard navigation (Tab, Arrow keys)
 */
export function useKeyboardNavigation({
  enabled,
  itemCount,
  onSelect,
  onFocus,
}: UseKeyboardNavigationProps) {
  const focusedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab: Cycle through items
      if (e.key === "Tab") {
        e.preventDefault();
        const currentIndex = focusedIndexRef.current ?? -1;
        const nextIndex = (currentIndex + 1) % itemCount;
        focusedIndexRef.current = nextIndex;
        onFocus?.(nextIndex);
      }

      // Arrow keys: Navigate
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = focusedIndexRef.current ?? -1;
        const nextIndex = (currentIndex + 1) % itemCount;
        focusedIndexRef.current = nextIndex;
        onFocus?.(nextIndex);
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = focusedIndexRef.current ?? -1;
        const prevIndex = currentIndex <= 0 ? itemCount - 1 : currentIndex - 1;
        focusedIndexRef.current = prevIndex;
        onFocus?.(prevIndex);
      }

      // Enter/Space: Select focused item
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedIndexRef.current !== null) {
          onSelect(focusedIndexRef.current);
        }
      }

      // Escape: Clear focus
      if (e.key === "Escape") {
        e.preventDefault();
        focusedIndexRef.current = null;
        onFocus?.(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, itemCount, onSelect, onFocus]);

  return {
    setFocusedIndex: (index: number | null) => {
      focusedIndexRef.current = index;
    },
    getFocusedIndex: () => focusedIndexRef.current,
  };
}
