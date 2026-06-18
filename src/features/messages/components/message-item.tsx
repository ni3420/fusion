"use client";

import { useState } from "react";
import { Edit2, Trash, MessageSquare, Smile, Loader2, ImageIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateMessage } from "../api/use-update-message";
import { useRemoveMessage } from "../api/use-remove-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-url";
import { useGetUploadImage } from "@/features/upload/api/use-get-upload-image";
import Editor from "@/components/editor";
import { toast } from "sonner";
import Image from "next/image";

interface MessageItemProps {
  id: Id<"messages">;
  memberId: Id<"members">;
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

export default function MessageItem({
  id,
  authorName,
  authorImage,
  authorEmail,
  body,
  image,
  gifUrl,
  createdAt,
  updatedAt,
  reactions,
  threadCount,
  threadImage,
  threadTimestamp,
  isMe,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  
  const { mutate: updateMessage, isPending: isUpdating } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemoving } = useRemoveMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  
  const { data: imageUrl, isLoading: isImageLoading } = useGetUploadImage({ 
    storageId: image 
  });

  const displayName = authorName || authorEmail || "Anonymous";
  const fallbackInitial = displayName.charAt(0).toUpperCase();

  const handleUpdate = async ({ body: newBody }: { body: string }) => {
    try {
      await updateMessage({ id, body: newBody });
      setIsEditing(false);
      toast.success("Message modified");
    } catch {
      toast.error("Failed to apply adjustments");
    }
  };

  const handleDelete = async () => {
    try {
      await removeMessage({ id });
      toast.success("Message purged");
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  const handleAssetUploadReplacement = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageProcessing(true);
      const uploadUrl = await generateUploadUrl({});
      
      if (!uploadUrl) throw new Error("Secure target reference generation failed");

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Storage sync bucket rejection");

      const { storageId } = await result.json();
      toast.success("New file snapshot successfully assigned");
    } catch {
      toast.error("Failed to accurately process target file update hook");
    } finally {
      setIsImageProcessing(false);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 max-w-[85%] group relative p-2 rounded-xl transition-colors w-fit mr-auto"
      )}
    >
      <Avatar className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-neutral-800 shrink-0 mt-0.5 select-none">
        <AvatarImage src={authorImage} alt={displayName} className="rounded-lg object-cover" />
        <AvatarFallback className="rounded-lg text-xs font-bold bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col min-w-0 flex-1 items-start">
        <div className="flex items-center gap-2 mb-1 select-none">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
            {isMe ? "You" : displayName}
          </span>
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {updatedAt && (
            <span className="text-[9px] font-medium text-neutral-400 dark:text-neutral-500 italic">
              (edited)
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="w-full min-w-[280px] sm:min-w-[400px] mt-1">
            <Editor
              placeholder="Edit your message..."
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              disabled={isUpdating}
            />
          </div>
        ) : (
          <div 
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300 prose dark:prose-invert break-words leading-relaxed max-w-none text-left"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}

        {isImageLoading && image && !isEditing && (
          <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-800 w-[360px] h-[240px] flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 animate-pulse">
            <ImageIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-600" />
          </div>
        )}

        {imageUrl && !isEditing && (
          <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 w-[360px] h-[240px] relative select-none bg-neutral-100 dark:bg-neutral-950 group/image">
            <Image 
              src={imageUrl} 
              alt="Message attached asset" 
              fill
              className="object-contain" 
              loading="lazy"
              unoptimized 
            />
            {isMe && (
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[11px] font-bold">
                {isImageProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Change Attachment"
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={isImageProcessing}
                  onChange={handleAssetUploadReplacement} 
                />
              </label>
            )}
          </div>
        )}

        {gifUrl && !isEditing && (
          <div className="mt-2 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 w-[240px] h-32 relative select-none">
            <Image 
              src={gifUrl} 
              alt="Message attachment asset" 
              fill
              className="object-cover" 
              unoptimized
            />
          </div>
        )}

        {reactions.length > 0 && !isEditing && (
          <div className="flex flex-wrap gap-1 mt-2 select-none justify-start">
            {reactions.map((rx) => (
              <button
                key={rx._id}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>{rx.value}</span>
                <span className="text-[10px] text-neutral-400 font-bold">{rx.count}</span>
              </button>
            ))}
          </div>
        )}

        {threadCount > 0 && !isEditing && (
          <button className="mt-2 flex items-center gap-1.5 group/thread text-neutral-500 dark:text-neutral-400 select-none flex-row">
            <Avatar className="h-4 w-4 rounded-sm border border-neutral-200 dark:border-neutral-800 shrink-0">
              <AvatarImage src={threadImage} className="rounded-sm object-cover" />
              <AvatarFallback className="rounded-sm text-[8px] font-bold bg-neutral-200 text-neutral-700">
                #
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-bold group-hover/thread:underline">
              {threadCount} {threadCount === 1 ? "reply" : "replies"}
            </span>
            <span className="text-[9px] font-medium text-neutral-400 dark:text-neutral-500">
              Last active {new Date(threadTimestamp!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </button>
        )}
      </div>

      {!isEditing && (
        <div 
          className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 p-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm z-10 select-none left-full ml-2"
          )}
        >
          <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 rounded-md">
            <Smile className="h-3.5 w-3.5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-500 rounded-md">
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>

          {isMe && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)} 
                className="h-6 w-6 text-neutral-500 rounded-md"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isRemoving || isImageProcessing}
                onClick={handleDelete} 
                className="h-6 w-6 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
              >
                {isRemoving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash className="h-3.5 w-3.5" />}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}