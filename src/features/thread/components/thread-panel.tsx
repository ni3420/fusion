"use client";

import { X, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import Editor from "@/components/editor";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useParams } from "next/navigation";
import { useGetMessageById } from "@/features/messages/api/use-get-messageById";
import { useCreateThreadReply } from "../api/use-create-thread-reply";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import MessageItem from "@/features/messages/components/message-list";
import { useGetCurrentMembers } from "@/features/members/api/use-current-memebr";

interface ThreadPanelProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export default function ThreadPanel({ messageId, onClose }: ThreadPanelProps) {
  const params = useParams();
  const workspaceId = useGetWorkSpaceId();
  const channelId = params.channelId as Id<"channels">;

  const { data: currentMember } = useGetCurrentMembers({ workspaceId });
  const { data: parentMessage, isLoading: isParentLoading } = useGetMessageById({ id: messageId });
  const { results: replies, status } = useGetMessages({ channelId, parentMessageId: messageId });
  const { mutate: createReply, isPending: isSubmitting } = useCreateThreadReply();
  console.log("replies",replies)

  const handleReplySubmit = async ({ body }: { body: string }) => {
    try {
      await createReply({
        body,
        workspaceId,
        channelId,
        parentMessageId: messageId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isInitialLoading = isParentLoading || status === "LoadingFirstPage";

  return (
    <div className="h-full flex flex-col border-l border-border/40 bg-background w-full absolute inset-0 md:relative md:max-w-[420px] z-50 shrink-0 animate-in slide-in-from-right duration-200 ease-out">
      
      {/* Header Bar Area */}
      <div className="flex items-center justify-between px-3 sm:px-4 h-[49px] border-b border-border/40 bg-background select-none shrink-0">
        <div className="flex items-center gap-x-2">
          {/* Back button visible on small devices to pop panel stack */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8 text-muted-foreground rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2]" />
          </Button>

          <div className="hidden md:flex items-center gap-x-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground/80 stroke-[2]" />
            <span className="text-[11px] font-black uppercase text-foreground tracking-wider">
              Thread
            </span>
          </div>
          
          <span className="md:hidden text-xs font-bold text-foreground">
            Thread Replies
          </span>
        </div>

        {/* Standard close trigger reserved for wider desktop canvases */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="hidden md:flex h-7 w-7 text-muted-foreground rounded-md hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4 stroke-[2]" />
        </Button>
      </div>

      {/* Main Content Area Frame */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-y-1.5 bg-background scrollbar-none">
        {isInitialLoading ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/60" />
          </div>
        ) : (
          <>
            {/* Parent Message Card Area Anchor */}
            {parentMessage && (
              <div className="border-b border-border/40 pb-2 mb-1.5">
                <MessageItem
                  id={parentMessage._id}
                  memberId={parentMessage.memberId}
                  currentMemberId={currentMember?._id ?? parentMessage.memberId}
                  workspaceId={workspaceId}
                  authorName={parentMessage.member?.user?.name || "Anonymous"}
                  authorImage={parentMessage.member?.user?.image}
                  authorEmail={parentMessage.member?.user?.email}
                  body={parentMessage.body}
                  image={parentMessage.image as Id<"_storage">}
                  gifUrl={parentMessage.gifUrl}
                  createdAt={parentMessage._creationTime}
                  updatedAt={parentMessage.updatedAt}
                  reactions={parentMessage.reactions || []}
                  threadCount={0}
                  isMe={parentMessage.memberId === currentMember?._id}
                />
              </div>
            )}

            {/* Replied Conversations List Stack */}
            <div className="flex flex-col flex-1">
              {replies?.map((reply) => (
                <MessageItem
                  key={reply._id}
                  id={reply._id}
                  memberId={reply.memberId}
                  currentMemberId={currentMember?._id ?? reply.memberId}
                  workspaceId={workspaceId}
                  authorName={reply.member?.user?.name || "Anonymous"}
                  authorImage={reply.member?.user?.image}
                  authorEmail={reply.member?.user?.email}
                  body={reply.body}
                  image={reply.image as Id<"_storage">}
                  gifUrl={reply.gifUrl}
                  createdAt={reply._creationTime}
                  updatedAt={reply.updatedAt}
                  reactions={reply.reactions || []}
                  threadCount={0}
                  isMe={reply.memberId === currentMember?._id}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Persistent Dock Input Footer Canvas Area */}
      <div className="p-3 sm:p-4 border-t border-border/40 bg-gradient-to-t from-background via-background to-transparent shrink-0">
        <Editor 
          placeholder="Reply..."
          onSubmit={handleReplySubmit}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}