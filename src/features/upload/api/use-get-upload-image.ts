import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetUploadImageProps {
  storageId?: Id<"_storage">;
}

export const useGetUploadImage = ({ storageId }: UseGetUploadImageProps) => {
  const data = useQuery(
    api.upload.getUrl, 
    storageId ? { storageId } : "skip"
  );

  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};