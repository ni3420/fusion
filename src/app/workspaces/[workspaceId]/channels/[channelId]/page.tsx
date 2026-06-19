"use client";

import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetChannel } from "@/features/channels/api/use-getchannel-Info";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetCurrentMembers } from "@/features/members/api/use-current-memebr";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-url";
import ChannelHeader from "@/features/channels/components/channel-header";
import MessageFeed from "@/features/messages/components/message-feed";
import Editor, { EditorValue } from "@/components/editor";
import { toast } from "sonner";
import { useState } from "react";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

export default function ChannelPage() {
  const params = useParams();
  const workspaceId = useGetWorkSpaceId();
  const channelId = params.channelId as Id<"channels">;
  const [isUploading, setIsUploading] = useState(false);

  const { data: currentMember, isLoading: memberLoading } = useGetCurrentMembers({ workspaceId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });
  const { results: messages, status, loadMore, canLoadMore } = useGetMessages({ channelId });
  const { mutate: createMessage, isPending: isSending } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const {mutate:reaction}=useToggleReaction()

  const handleMessageSubmit = async ({ body, image, gifUrl }: EditorValue & { image?: File | null }) => {
    try {
      let storageId: Id<"_storage"> | undefined = undefined;

      if (image) {
        setIsUploading(true);
        const uploadUrl = await generateUploadUrl({}, {
          onError: () => {
            toast.error("Failed to generate upload secure token");
          }
        });

        if (!uploadUrl) {
          throw new Error("Upload URL generation failed");
        }

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("File delivery target write failure");
        }

        const data = await result.json();
        storageId = data.storageId;
      }

      await createMessage({
        body,
        workspaceId,
        channelId,
        gifUrl: gifUrl ?? undefined,
        image: storageId,
      });
    } catch {
      toast.error("Failed to distribute message payload");
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = channelLoading || memberLoading;

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 gap-y-2">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 tracking-tight">
          Synchronizing space parameters...
        </span>
      </div>
    );
  }

  if (!channel || !currentMember) {
    return (
      <div className="h-full flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 gap-y-2 px-4 text-center">
        <AlertCircle className="h-5 w-5 text-red-500/80" />
        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">
          Channel Context Unresolved
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex flex-col bg-white dark:bg-neutral-900">

      <MessageFeed
        messages={messages}
        status={status}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        currentMemberId={currentMember._id}
      />

      <div className="p-4 w-full border-t border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <Editor 
          placeholder={`Message #${channel.name}`} 
          onSubmit={handleMessageSubmit}
          disabled={isSending || isUploading}
        />
      </div>
    </div>
  );
}