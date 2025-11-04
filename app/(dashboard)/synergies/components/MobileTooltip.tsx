"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
}

/**
 * Simplified tooltip that adapts for mobile devices
 * On mobile: Shows simplified text
 * On desktop: Shows full rich tooltip
 */
export function MobileTooltip({
  content,
  children,
  delayDuration = 250,
}: MobileTooltipProps) {
  const isMobile = useIsMobile();
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  if (isMobile) {
    // On mobile, use a simple tap-to-show pattern
    return (
      <div>
        <div onClick={() => setShowMobileInfo(!showMobileInfo)}>{children}</div>
        {showMobileInfo && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover text-popover-foreground border border-border rounded-md px-3 py-2 text-xs shadow-lg max-w-[200px] z-50">
            {content}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileInfo(false);
              }}
              className="absolute top-1 right-1 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }

  // On desktop, use normal tooltip
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
