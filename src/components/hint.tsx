"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function Hint({
  label,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
}: HintProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 border-none rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-wide shadow-md animate-in fade-in-0 zoom-in-95 duration-150 select-none max-w-xs break-words"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}