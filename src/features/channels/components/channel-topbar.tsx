"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { useGetChannel } from "../api/use-getchannel-Info";
import { Id } from "../../../../convex/_generated/dataModel";
import ChannelHeader from "./channel-header";
import { Button } from "@/components/ui/button";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function ChannelTopBar() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  
  const channelId = params.channelId as Id<"channels">;

  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading) {
    return (
      <div className="h-14 border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!channel) {
    return null;
  }

  return (
    <div className="flex items-center w-full bg-white dark:bg-neutral-900 border-b border-neutral-200/80 dark:border-neutral-800 shrink-0 pr-4">
      <div className="md:hidden pl-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => router.push(`/workspaces/${workspaceId}`)}
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
        </Button>
      </div>
      <div className="flex-1">
        <ChannelHeader
          name={channel.name}
          channelId={channel._id}
          isAdmin={true}
        />
      </div>
    </div>
  );
}