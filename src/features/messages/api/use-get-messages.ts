import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export type useGetMessagesResult = {
  results: typeof api.messages.get._returnType["page"];
  status: "LoadingFirstPage" | "LoadingMore" | "CanLoadMore" | "Exhausted";
  loadMore: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  isExhausted: boolean;
};

export const useGetMessages = ({ 
  channelId, 
  conversationId, 
  parentMessageId 
}: UseGetMessagesProps): useGetMessagesResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
    isLoading: status === "LoadingFirstPage",
    isLoadingMore: status === "LoadingMore",
    canLoadMore: status === "CanLoadMore",
    isExhausted: status === "Exhausted",
  };
};