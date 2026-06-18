"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SideBar from "@/features/workspaces/components/sidebar";
import ToolBar from "@/features/workspaces/components/toolbar";
import WorkSpaceSideBar from "@/features/workspaces/components/workspace-sidebar";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkSpacesProps {
  children: React.ReactNode;
}

const WorkSpacesLayout = ({ children }: WorkSpacesProps) => {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const hasActiveConversation = !!(params?.channelId || params?.memberId);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground antialiased">
        {/* Top Navbar Area Mock */}
        <div className="h-10 border-b border-border/40 w-full flex items-center px-4 bg-background justify-center">
          <Skeleton className="h-6 w-[400px] rounded-md" />
        </div>
        
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Static Sidebar Mock Column */}
          <div className="hidden md:flex w-[84px] h-full bg-background border-r border-border/40 flex-col items-center py-6 gap-y-6 shrink-0">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>

          {/* Sub Workspace Nav Panel Area Mock */}
          <div className="hidden md:flex w-[260px] h-full bg-background border-r border-border/40 p-4 flex-col gap-y-4 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-32 h-5 rounded" />
              <Skeleton className="w-5 h-5 rounded-md" />
            </div>
            <Skeleton className="w-5/6 h-4 rounded" />
            <Skeleton className="w-2/3 h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
            <div className="h-px bg-border/40 my-2" />
            <Skeleton className="w-1/2 h-3 rounded" />
            <Skeleton className="w-5/6 h-4 rounded" />
            <Skeleton className="w-4/5 h-4 rounded" />
          </div>

          {/* Core Right Main Context Area Panel Mock */}
          <div className="flex-1 h-full bg-background p-6 flex flex-col gap-y-4 justify-between">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <Skeleton className="w-48 h-6 rounded" />
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
            <div className="flex-1 flex flex-col gap-y-4 justify-end pb-8">
              <div className="flex gap-x-3 items-start">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-2 w-full max-w-xl">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex gap-x-3 items-start">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-2 w-full max-w-md">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
            <Skeleton className="w-full h-[44px] rounded-xl border border-border/40 mt-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground antialiased selection:bg-primary/10">
      <ToolBar />

      <div className="flex flex-1 w-full overflow-hidden relative">
        
        {/* MOBILE VIEW NAVIGATION LOGIC */}
        <div className="flex flex-1 w-full md:hidden overflow-hidden bg-background">
          {hasActiveConversation ? (
            <main className="flex-1 h-full w-full overflow-y-auto relative bg-background pb-16">
              {children}
            </main>
          ) : (
            <div className="w-full h-full pb-16">
              <WorkSpaceSideBar />
            </div>
          )}
          <SideBar />
        </div>

        {/* DESKTOP VIEW BOTH SIDEBARS AND RESIZABLE CANVAS */}
        <div className="hidden md:flex flex-1 h-full overflow-hidden">
          <SideBar />
          
          <ResizablePanelGroup 
            dir="horizontal" 
            autoSave="aura-workspace-canvas-layout" 
            className="h-full items-stretch"
          >
            <ResizablePanel 
              defaultSize={22} 
              minSize={250} 
              maxSize={300}
              className="h-full"
            >
              <WorkSpaceSideBar />
            </ResizablePanel>

            <ResizableHandle withHandle className="w-[1px] bg-border/40" />

            <ResizablePanel defaultSize={78}>
              <main className="h-full bg-background overflow-y-auto relative">
                <div className="h-full w-full max-w-[1600px] mx-auto">
                  {children}
                </div>
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

      </div>
    </div>
  );
};

export default WorkSpacesLayout;