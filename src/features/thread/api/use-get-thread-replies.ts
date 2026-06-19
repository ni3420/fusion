import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetThreadRepliesProps = {
  parentMessageId: Id<"messages">;
  workspaceId: Id<"workspaces">;
};

export const useGetThreadReplies = ({ parentMessageId, workspaceId }: UseGetThreadRepliesProps) => {
  const data = useQuery(api.thread.getThreadReplies, { parentMessageId, workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};