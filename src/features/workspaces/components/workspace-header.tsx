"use client";

import { useState } from "react";
import { ChevronDown, ListFilter, SquarePen, Settings, Users, PlusCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Hint } from "@/components/hint";
import { useMobileSidebar } from "../hooks/use-mobile-sidebar";
import Preference from "./Preference-model";
import InviteCard from "./workspace-invite-card";
import { useResetJoinCode } from "../hooks/use-reset-code";
import { useGetWorkSpaceId } from "../hooks/use-workspace-id";
import { toast } from "sonner";
interface WorkspaceHeaderProps {
  workspace: {
    name: string;
    isAdmin: boolean;
    joinCode: string; 
  };
}

export default function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false); // Controls the invite dialog view

  const workspaceId = useGetWorkSpaceId(); 
const { mutate} = useResetJoinCode();

const handleResetInviteCode = async () => {
  await mutate(
    {
      workspaceId,
    },
    {
      onSuccess: () => {
        toast.success("Workspace joining authorization code rotated successfully!");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to rotate access token credentials.");
      },
    }
  );
};
  return (
    <>
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="md:hidden h-8 w-8 text-neutral-600 dark:text-neutral-400 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button> */}

          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 p-1.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1 max-w-[140px] md:max-w-[180px] justify-start focus-visible:ring-0 outline-none transition-all"
              >
                <span className="truncate">{workspace.name}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-64 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-md z-30"
            >
              <DropdownMenuItem className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 focus:bg-neutral-50 dark:focus:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 cursor-default">
                <div className="h-9 w-9 rounded-md bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 flex items-center justify-center font-bold text-sm shrink-0">
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {workspace.name}
                  </span>
                  <span className="text-[10px] font-medium text-neutral-400 mt-0.5">
                    Active Environment Hub
                  </span>
                </div>
              </DropdownMenuItem>

              {workspace.isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1.5" />
                  
                  <DropdownMenuItem 
                    onClick={() => setPreferencesOpen(true)}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:text-neutral-900 dark:focus:text-neutral-100 cursor-pointer transition-colors"
                  >
                    <Settings className="h-4 w-4 text-neutral-400" />
                    Workspace Parameters
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => {}}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:text-neutral-900 dark:focus:text-neutral-100 cursor-pointer transition-colors"
                  >
                    <Users className="h-4 w-4 text-neutral-400" />
                    Manage Collaboration Team
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => setInviteOpen(true)} // FIXED: Opens the secure dialog overlay setup instead of nesting items
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:text-neutral-900 dark:focus:text-neutral-100 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-neutral-400" />
                    Invite Members Pipeline
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Hint label="Filter tracking logs" side="bottom" align="center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </Hint>

          <Hint label="Compose new transmission" side="bottom" align="end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <SquarePen className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
      </div>
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="max-w-3xl w-auto h-auto sm:h-auto sm:max-h-[720px] p-0 overflow-y-auto bg-white dark:bg-neutral-950 gap-0 border-neutral-200 dark:border-neutral-900 rounded-none sm:rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Workspace Settings Preferences</DialogTitle>
            <DialogDescription>Modify workspace control configuration paths and aliases</DialogDescription>
          </DialogHeader>
          
          <div className="sticky top-0 right-0 p-4 flex justify-end z-50 pointer-events-none sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreferencesOpen(false)}
              className="h-8 w-8 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 pointer-events-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white dark:bg-neutral-950 h-full w-full">
            <Preference
              initialData={{
                name: workspace.name,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>Share workspace join codes with new contributors</DialogDescription>
          </DialogHeader>
          <InviteCard
            workspaceName={workspace.name}
            joinCode={workspace.joinCode}
            onResetCode={handleResetInviteCode}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}