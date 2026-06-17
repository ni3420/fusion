"use client";

import { useGetWorkSpaceById } from "@/features/workspaces/api/use-get-workspaceById";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import WorkspaceHeader from "./workspace-header";
import SideBarItem from "./sidebar-items";
import { Loader2, AlertCircle, Hash } from "lucide-react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/hooks/use-create-model";
import WorkspaceSection from "./workspace-section";

export default function WorkSpaceSideBar() {
  const workspaceId = useGetWorkSpaceId();
  const params = useParams();
  
  const activeChannelId = params?.channelId as string;
  const activeMemberId = params?.memberId as string;

  const [, setOpenChannelModal] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpaceById({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  const isLoading = workspaceLoading || channelsLoading || membersLoading;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/50 gap-y-2">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400 dark:text-neutral-500" />
        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 tracking-tight">
          Synchronizing space parameters...
        </span>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/50 gap-y-2 px-4 text-center">
        <AlertCircle className="h-5 w-5 text-red-500/80" />
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">
          Workspace Context Unresolved
        </span>
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 max-w-[180px]">
          The workspace parameters could not be read or do not exist.
        </span>
      </div>
    );
  }

  return (
    <aside className="h-full flex flex-col bg-neutral-50/50 dark:bg-neutral-900/50 border-r border-neutral-200/40 dark:border-neutral-800/40 select-none">
      <WorkspaceHeader workspace={{ name: workspace.name, isAdmin: true, joinCode:workspace.joinCode}} />
      
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-2">
        {/* Live Channels Section Container */}
        <WorkspaceSection 
          label="Channels" 
          hint="Workspace communication nodes" 
          onNew={() => setOpenChannelModal(true)} // FIXED: Opens the channel creation modal
        >
          {channels?.map((channel) => (
            <SideBarItem
              key={channel._id}
              id={channel._id}
              label={channel.name}
              icon={Hash}
              variant={activeChannelId === channel._id ? "active" : "default"}
            />
          ))}
        </WorkspaceSection>

        {/* Live Direct Messages Section Container */}
        <WorkspaceSection 
          label="Direct Messages" 
          hint="Direct communication channels with team members"
        >
          {members?.map((member) => {
            const isActive = activeMemberId === member._id;
            const displayName = member.user?.name || member.user?.email || "Anonymous Member";
            const fallbackInitial = displayName.charAt(0).toUpperCase();

            return (
              <Link
                key={member._id}
                href={`/workspaces/${workspaceId}/member/${member._id}`}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all group",
                  isActive
                    ? "text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800/80 shadow-3xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                )}
              >
                <Avatar className="h-5 w-5 rounded-md border border-neutral-200 dark:border-neutral-800 shrink-0">
                  <AvatarImage src={member.user?.image} alt={displayName} className="rounded-md" />
                  <AvatarFallback className="rounded-md text-[9px] font-bold bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
                    {fallbackInitial}
                  </AvatarFallback>
                </Avatar>
                
                <span className="truncate flex-1 text-neutral-700 dark:text-neutral-300">
                  {displayName}
                </span>
                
                {member.role === "admin" && (
                  <span className="text-[9px] font-medium px-1.5 py-0.2 bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-sm scale-90">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </WorkspaceSection>
      </div>
    </aside>
  );
}