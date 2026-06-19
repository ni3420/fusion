import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type UseGetMessageByIdProps = {
  id: Id<"messages">;
};

export const useGetMessageById = ({ id }: UseGetMessageByIdProps) => {
  const data = useQuery(api.messages.getMessageById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};