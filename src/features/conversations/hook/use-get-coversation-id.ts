import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateOrGetConversation } from "../api/use-create-or-get-conversation";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetConversationId = () => {
  const params = useParams();
  const workspaceId = params.workspaceId as Id<"workspaces">;
  const memberId = params.memberId as Id<"members">;

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const [isPending, setIsPending] = useState(true);

  const { mutate: getConversation } = useCreateOrGetConversation();

  useEffect(() => {
    if (!workspaceId || !memberId) return;

    const init = async () => {
      try {
        setIsPending(true);
        const response = await getConversation({
          memberId,
          workspaceId,
        });
        
        const id = typeof response === "object" ? response?._id: response;
        if (id) {
          setConversationId(id as Id<"conversations">);
        }
      } catch (err) {
        console.error("Failed to resolve conversation index hook:", err);
      } finally {
        setIsPending(false);
      }
    };

    init();
  }, [getConversation, memberId, workspaceId]);

  return { conversationId, isPending };
};