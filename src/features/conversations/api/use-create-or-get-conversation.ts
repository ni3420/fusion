import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  workspaceId: Id<"workspaces">;
  memberId: Id<"members">;
};

export const useCreateOrGetConversation = () => {
  const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);
  const isPending = useMemo(() => status === "pending", [status]);

  const mutation = useMutation(api.conversations.getOrCreate);

  const mutate = useCallback(
    async (values: RequestType) => {
      try {
        setStatus("pending");
        const response = await mutation(values);
        setStatus("success");
        return response;
      } catch (err) {
        setStatus("error");
        throw err;
      } finally {
        setStatus("settled");
      }
    },
    [mutation]
  );

  return { mutate, isPending };
};