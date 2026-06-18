import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGenerateUploadUrl = () => {
  const mutation = useMutation(api.upload.generateUploadUrl);
  return { mutate: mutation };
};