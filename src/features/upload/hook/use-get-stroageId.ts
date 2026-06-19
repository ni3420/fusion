import { useState, useCallback } from "react";

export const useStorageFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    if (!selectedFile) {
      setFile(null);
      setFilePreview(null);
      return;
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  }, [filePreview]);

  const clearFile = useCallback(() => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
  }, [filePreview]);

  return {
    file,
    filePreview,
    handleFileChange,
    clearFile,
  };
};