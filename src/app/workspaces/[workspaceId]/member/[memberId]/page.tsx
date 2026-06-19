"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGetCurrentMembers } from "@/features/members/api/use-current-memebr";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import MessageItem from "@/features/messages/components/message-list";
import Editor from "@/components/editor";
import { useGetConversationId } from "@/features/conversations/hook/use-get-coversation-id";
import { useGenerateUploadUrl } from "@/features/messages/api/use-upload";
import { toast } from "sonner";

interface SubmitValues {
  body: string;
  image?: File | null;
}

const MemberPage = () => {
  const params = useParams();
  const workspaceId = useGetWorkSpaceId();
  const memberId = params.memberId as Id<"members">;

  const [isUploading, setIsUploading] = useState(false);

  const { conversationId, isPending: isConversationPending } = useGetConversationId();
  const { data: currentMember, isLoading: loadingCurrentMember } = useGetCurrentMembers({ workspaceId });
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: sendMessage, isPending: isSending } = useCreateMessage();

  const { results: messages, status: messagesStatus } = useGetMessages({ 
    conversationId: conversationId ?? undefined
  });

  const handleMessageSubmit = async ({ body, image }: SubmitValues) => {
    try {
      if (!conversationId) return;
      setIsUploading(true);

      let storageId: Id<"_storage"> | undefined = undefined;

      if (image) {
        const uploadUrl = await generateUploadUrl({});

        if (!uploadUrl) {
          throw new Error("Upload URL generation failed");
        }

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        const { storageId: returnedStorageId } = await result.json();
        storageId = returnedStorageId;
      }

      await sendMessage({
        body,
        workspaceId,
        conversationId,
        image: storageId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to transmit image sequence context parameters");
    } finally {
      setIsUploading(false);
    }
  };

  const isInitialLoading = 
    isConversationPending || 
    loadingCurrentMember || 
    (conversationId && messagesStatus === "LoadingFirstPage");

  if (isInitialLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-background select-none text-center p-6">
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          Failed to load conversation context link
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      
      <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-y-4 p-4 custom-scrollbar">
        <div className="flex flex-col gap-y-3">
          {messages?.map((message) => (
            <MessageItem
              key={message._id}
              id={message._id}
              memberId={memberId}
              currentMemberId={currentMember?._id ?? message.memberId}
              workspaceId={workspaceId}
              authorName={message.member?.user?.name || "Anonymous"}
              authorImage={message.member?.user?.image}
              authorEmail={message.member?.user?.email}
              body={message.body}
              image={message.image}
              gifUrl={message.gifUrl}
              createdAt={message._creationTime}
              updatedAt={message.updatedAt}
              reactions={message.reactions || []}
              threadCount={message.threadCount || 0}
              threadImage={message.threadImage}
              threadTimestamp={message.threadTimestamp}
              isMe={message.memberId === currentMember?._id}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-background border-t border-border/40">
        <Editor
          placeholder="Type your message..."
          onSubmit={handleMessageSubmit}
          disabled={isSending || isUploading}
        />
      </div>
    </div>
  );
};

export default MemberPage;