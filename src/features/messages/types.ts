import { Id } from "../../../convex/_generated/dataModel";
import { useGetMessagesResult } from "./api/use-get-messages";
export interface MessageItemProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  currentMemberId: Id<"members">;
  workspaceId: Id<"workspaces">;
  authorName: string;
  authorImage?: string;
  authorEmail?: string;
  body: string;
  image?: Id<"_storage">; 
  gifUrl?: string;
  createdAt: number;
  updatedAt?: number;
  reactions: Array<{ _id: Id<"reactions">; value: string; count: number; memberId: Id<"members"> }>;
  threadCount: number;
  threadImage?: string;
  threadTimestamp?: number;
  isMe: boolean;
}


export interface MsgToolBarProps {
  isMe: boolean;
  isRemoving?: boolean;
  isImageProcessing?: boolean;
  onReactionToggle: (emoji: string) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onThreadClick?: () => void;
  className?: string;
}


export interface MessageFeedProps {
  messages: useGetMessagesResult["results"];
  status: useGetMessagesResult["status"];
  loadMore: () => void;
  canLoadMore: boolean;
  currentMemberId: Id<"members">;
}
