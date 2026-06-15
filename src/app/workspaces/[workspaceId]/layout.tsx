"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SideBar from "@/features/workspaces/components/sidebar";
import ToolBar from "@/features/workspaces/components/toolbar";
import WorkSpaceSideBar from "@/features/workspaces/components/workspace-sidebar";

interface WorkSpacesProps {
  children: React.ReactNode;
}

const WorkSpacesLayout = ({ children }: WorkSpacesProps) => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950">
        <ToolBar />
        <div className="flex flex-1 overflow-hidden">
          <SideBar />
          <ResizablePanelGroup dir="horizontal" autoSave="ca-workspace-layout" >
            <ResizablePanel defaultSize={20} minSize={300} >
              <div className="h-full bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/60 dark:border-neutral-900/80">
                <WorkSpaceSideBar/>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel >
              <div className="h-full bg-white dark:bg-neutral-900 overflow-y-auto">
                {children}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
};

export default WorkSpacesLayout;