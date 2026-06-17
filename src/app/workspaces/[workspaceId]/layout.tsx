"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SideBar from "@/features/workspaces/components/sidebar";
import ToolBar from "@/features/workspaces/components/toolbar";
import WorkSpaceSideBar from "@/features/workspaces/components/workspace-sidebar";
import { useParams } from "next/navigation";

interface WorkSpacesProps {
  children: React.ReactNode;
}

const WorkSpacesLayout = ({ children }: WorkSpacesProps) => {
  const params = useParams();
  const hasActiveConversation = !!(params?.channelId || params?.memberId);

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