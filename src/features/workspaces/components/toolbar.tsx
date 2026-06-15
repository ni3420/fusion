"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2 } from "lucide-react";

export default function ToolBar() {
  const workspaceId = useGetWorkSpaceId();
  const { data: workspace, isLoading } = useGetWorkSpaceById({ id: workspaceId });

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 h-12 p-2.5 shadow-sm">
      <div className="flex-1" />
      
      <div className="max-w-[642px] grow-[2] shrink">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="w-full h-8 justify-start px-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800 rounded-lg gap-2 font-normal text-xs transition-colors"
        >
          <Search className="h-4 w-4 shrink-0 text-neutral-400" />
          <span className="truncate">
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Synchronizing workspace indicators...
              </span>
            ) : (
              `Search channels or tracks inside ${workspace?.name || "Workspace"}`
            )}
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-400 ml-auto shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}