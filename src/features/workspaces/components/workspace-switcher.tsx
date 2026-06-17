"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workpspaces";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useWorkspaceModel } from "@/store/use-workspace-model";
import { useRouter } from "next/navigation";
import { Building2, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateWorkspaceModal from "./create-workspace-model";

interface SwitcherContentProps {
  activeLetter: string;
  activeWorkspaceName?: string;
  filteredWorkspaces?: any[];
  onWorkspaceSelect: (id: string) => void;
  onNewHubClick: () => void;
}

function SwitcherContent({
  activeLetter,
  activeWorkspaceName,
  filteredWorkspaces,
  onWorkspaceSelect,
  onNewHubClick,
}: SwitcherContentProps) {
  return (
    <>
      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        Active Hub
      </div>
      
      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-default">
        <div className="h-6 w-6 rounded-md bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
          {activeLetter}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {activeWorkspaceName}
          </span>
          <span className="text-[10px] font-medium text-neutral-400 mt-0.5">
            Current space context
          </span>
        </div>
      </div>

      {filteredWorkspaces && filteredWorkspaces.length > 0 && (
        <>
          <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1.5" />
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Other Workspaces
          </div>
          <div className="max-h-[160px] overflow-y-auto space-y-0.5 pr-0.5">
            {filteredWorkspaces.map((ws) => (
              <div
                key={ws._id}
                onClick={() => onWorkspaceSelect(ws._id)}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors min-w-0"
              >
                <div className="h-6 w-6 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-semibold text-xs shrink-0">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{ws.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1.5" />

      <div
        onClick={onNewHubClick}
        className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors"
      >
        <div className="h-6 w-6 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0">
          <Plus className="h-3 w-3 text-neutral-500" />
        </div>
        Initialize New Hub
      </div>
    </>
  );
}

export default function WorkSpaceSwitcher() {
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  const [open, setOpen] = useWorkspaceModel();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: activeWorkspace, isLoading: activeWorkspaceLoading } = useGetWorkSpaceById({ id: workspaceId });

  const filteredWorkspaces = workspaces?.filter((ws) => ws._id !== workspaceId);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (activeWorkspaceLoading || workspacesLoading) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-400 rounded-xl"
        disabled
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  const activeLetter = activeWorkspace?.name?.charAt(0).toUpperCase() || "W";

  const handleTriggerClick = () => {
    if (isMobile) {
      setMobileOpen(true);
    }
  };

  const handleWorkspaceSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
    setMobileOpen(false);
  };

  const handleNewHubClick = () => {
    setMobileOpen(false);
    setOpen(true);
  };

  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant="ghost"
            onClick={handleTriggerClick}
            className="h-14 w-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 flex items-center justify-center font-bold text-lg shadow-xs focus-visible:ring-0 outline-none p-0 shrink-0 transition-all active:scale-95 border border-neutral-200 dark:border-neutral-800"
          >
            {activeWorkspace?.name ? activeLetter : <Building2 className="h-5 w-5" />}
          </Button>

          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xl gap-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Switch Workspace</DialogTitle>
                <DialogDescription>Select active hub</DialogDescription>
              </DialogHeader>
              <SwitcherContent 
                activeLetter={activeLetter}
                activeWorkspaceName={activeWorkspace?.name}
                filteredWorkspaces={filteredWorkspaces}
                onWorkspaceSelect={handleWorkspaceSelect}
                onNewHubClick={handleNewHubClick}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-14 w-14 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 flex items-center justify-center font-bold text-lg shadow-xs focus-visible:ring-0 outline-none p-0 shrink-0 transition-all active:scale-95 border border-neutral-200 dark:border-neutral-800"
            >
              {activeWorkspace?.name ? activeLetter : <Building2 className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="right"
            sideOffset={16}
            className="w-64 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-md z-30"
          >
            <SwitcherContent 
              activeLetter={activeLetter}
              activeWorkspaceName={activeWorkspace?.name}
              filteredWorkspaces={filteredWorkspaces}
              onWorkspaceSelect={handleWorkspaceSelect}
              onNewHubClick={handleNewHubClick}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <CreateWorkspaceModal />
    </>
  );
}