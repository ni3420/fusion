"use client";

import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import MessageItem from "./message-list";
import {MessageFeedProps} from "../types"

export default function MessageFeed({
  messages,
  status,
  loadMore,
  canLoadMore,
  currentMemberId,
}: MessageFeedProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const workspaceId = useGetWorkSpaceId();

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && canLoadMore && status !== "LoadingMore") {
      const previousScrollHeight = container.scrollHeight;
      
      loadMore();

      const mutationObserver = new MutationObserver(() => {
        container.scrollTop = container.scrollHeight - previousScrollHeight;
        mutationObserver.disconnect();
      });

      mutationObserver.observe(container, { childList: true, subtree: true });
    }
  };

  const groupMessagesByDate = (items: typeof messages) => {
    return items.reduce((groups, message) => {
      const date = new Date(message._creationTime).toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {} as Record<string, typeof messages>);
  };

  const groupedMessages = groupMessagesByDate([...messages].reverse());

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-y-6 custom-scrollbar"
    >
      {status === "LoadingMore" && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
        </div>
      )}

      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="flex flex-col gap-y-3">
          <div className="relative flex items-center justify-center my-2 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100 dark:border-neutral-900" />
            </div>
            <span className="relative px-3 bg-white dark:bg-neutral-900 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase rounded-full border border-neutral-100 dark:border-neutral-900 py-0.5">
              {date}
            </span>
          </div>

          {dateMessages.map((message) => (
            <MessageItem
              key={message._id}
              id={message._id}
              memberId={message.memberId}
              currentMemberId={currentMemberId}
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
              isMe={currentMemberId === message.memberId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}