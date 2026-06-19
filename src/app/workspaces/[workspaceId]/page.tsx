"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { MessageSquarePlus, Hash, Sparkles } from "lucide-react";

export default function WorkspacePage() {
  const workspaceId = useGetWorkSpaceId();
  const { data: workspace, isLoading } = useGetWorkSpaceById({ id: workspaceId });

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-background gap-y-2">
        <div className="text-xs text-muted-foreground/60 animate-pulse font-medium tracking-tight">
          Loading workspace session variables...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center bg-background text-center px-4 relative overflow-hidden select-none">
      
      {/* Subtle modern ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="max-w-sm w-full flex flex-col items-center space-y-4 relative z-10 animate-in fade-in-50 slide-in-from-bottom-4 duration-300 ease-out">
        
        {/* Dynamic Structural Icon Canvas Assembly */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/40 border border-border/60 shadow-3xs text-muted-foreground group">
          <MessageSquarePlus className="w-6 h-6 stroke-[1.8] group-hover:scale-105 transition-transform duration-200" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-black border-2 border-background shadow-2xs">
            <Hash className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        </div>

        {/* Informational Message Typography Nodes */}
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            Welcome to {workspace?.name || "your Workspace"}
          </h2>
          <p className="text-[12px] leading-normal font-normal text-muted-foreground max-w-[260px] mx-auto">
            Select a channel or direct message from the sidebar panel map to initialize a real-time conversation stream.
          </p>
        </div>

      </div>
    </div>
  );
}