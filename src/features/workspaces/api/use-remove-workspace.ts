import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { id: Id<"workspaces"> };
type ResponseType = Id<"workspaces"> | null;

export const useRemoveWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const mutation = useMutation(api.workspaces.remove);

  const execute = useCallback(async (values: RequestType) => {
    try {
      setData(null);
      setError(null);
      setStatus("loading");
      
      const response = await mutation(values);
      setData(response);
      setStatus("success");
      return response;
    } catch (err) {
      const errorObject = err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(errorObject);
      setStatus("error");
      throw errorObject;
    }
  }, [mutation]);

  return {
    execute,
    data,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
  };
};