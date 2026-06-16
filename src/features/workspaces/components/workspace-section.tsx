"use client";

import { useToggle } from "react-use";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint"; 

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export default function WorkspaceSection({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2 space-y-0.5 select-none">
      <div className="flex items-center justify-between px-1.5 group h-7">
        <button
          onClick={toggle}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors min-w-0"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform duration-150 text-neutral-400",
              !on && "-rotate-90"
            )}
          />
          <span className="truncate">
            {label}
          </span>
        </button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew} // FIXED: Clicks are cleanly handled on the button container now
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded-md text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all ml-auto"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </Hint>
        )}
      </div>

      {on && (
        <div className="flex flex-col gap-y-0.5 animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}