"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels"; 
import { useGetMembers } from "@/features/members/api/use-get-members";   
import { Button } from "@/components/ui/button";
import { Search, Info, Loader2, MessageSquare, User, SearchAlertIcon } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function ToolBar() {
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  
  const [open, setOpen] = useState(false);

  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkSpaceById({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleChannelSelect = (channelId: string) => {
    setOpen(false);
    console.log("channels")
    router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  const handleMemberSelect = (memberId: string) => {
    setOpen(false);
    router.push(`/workspaces/${workspaceId}/member/${memberId}`);
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 h-12 p-2.5 shadow-sm">
        <div className="flex-1" />
        
        <div className="max-w-[642px] grow-[2] shrink">
          <Button
            variant="outline"
            size="sm"
            disabled={isWorkspaceLoading}
            onClick={() => setOpen(true)}
            className="w-full h-8 justify-start px-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800 rounded-lg gap-2 font-normal text-xs transition-colors"
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="truncate">
              {isWorkspaceLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Synchronizing workspace indicators...
                </span>
              ) : (
                `Search channels or members inside ${workspace?.name || "Workspace"}`
              )}
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium text-neutral-400 ml-auto shadow-2xs hidden sm:flex">
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="hii"/>
          <CommandEmpty>no results found</CommandEmpty>
          <CommandGroup heading="channels">
            <CommandList>
            {channels?.map((items)=>(
              <CommandItem key={items._id} onSelect={()=>handleChannelSelect(items._id)}>
                <Search/>
                <span>{items.name}</span>
              </CommandItem>
            ))}
            </CommandList>
          </CommandGroup >
          <CommandGroup heading="members">
            <CommandList>
              {members?.map((m)=>(
                <CommandItem key={m._id} onSelect={()=>handleMemberSelect(m._id)}>
                  <Search/>
                  <span>{m.user?.name}</span>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>

          </Command>       
      </CommandDialog>
    </>
  );
}