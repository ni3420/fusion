"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetUploadImage } from "@/features/upload/api/use-get-upload-image";

interface ShowImageProps {
  storageId?: string;
}

export default function ShowImage({ storageId }: ShowImageProps) {
  const validatedStorageId = storageId ? (storageId as Id<"_storage">) : undefined;

  const { data: imageUrl, isLoading } = useGetUploadImage({ 
    storageId: validatedStorageId 
  });

  if (!storageId) return null;

  if (isLoading) {
    return (
      <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-800 w-[360px] h-[240px] flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 animate-pulse">
        <ImageIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-600" />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 w-[360px] h-[240px] relative select-none bg-neutral-100 dark:bg-neutral-950 group/image">
      <Image 
        src={imageUrl} 
        alt="Attached asset preview" 
        fill
        className="object-cover"
        loading="eager"
        unoptimized 
      />
    </div>
  );
}