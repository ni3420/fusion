"use client";

import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUpdateMessage } from "../api/use-update-message";
import { useRemoveMessage } from "../api/use-remove-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-url";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import Editor from "@/components/editor";
import Reaction from "@/features/reactions/components/reaction";
import ShowImage from "@/features/upload/components/Show-Image";
import MsgToolBar from "./message-toolbar"; 
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { MessageItemProps } from "../types";
import { usePanel } from "@/features/messages/hooks/use-panel";
import { useUpdateImage } from "@/features/upload/api/use-update-image";

export default function MessageItem({
  id,
  currentMemberId,
  workspaceId,
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
  const { openPanel } = usePanel();

  const { mutate: updateMessage, isPending: isUpdating } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemoving } = useRemoveMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: toggleReaction } = useToggleReaction();
  const { mutate: updateImage } = useUpdateImage();

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

  const handleReactionToggle = async (value: string) => {
    try {
      await toggleReaction({
        messageId: id,
        value,
        workspaceId,
      });
    } catch {
      toast.error("Failed to alter selection context matrix");
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
      await updateImage({ messageId: id, storageId });

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
        "w-full flex items-start gap-2.5 sm:gap-3 px-3 sm:px-5 py-2 group relative transition-colors duration-100 ease-out select-none md:select-text",
        isEditing ? "bg-amber-50/40 dark:bg-amber-950/10" : "hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30"
      )}
    >
      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-md border border-neutral-200/60 dark:border-neutral-800/60 shrink-0 mt-0.5 select-none">
        <AvatarImage src={authorImage} alt={displayName} className="rounded-md object-cover" />
        <AvatarFallback className="rounded-md text-xs font-bold bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900">
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col min-w-0 flex-1 items-start pr-1 sm:pr-4">
        <div className="flex items-baseline gap-2 mb-0.5 select-none flex-wrap">
          <span className="text-[13px] font-black text-neutral-900 dark:text-neutral-100 truncate hover:underline cursor-pointer tracking-tight">
            {displayName}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-tight">
            {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {updatedAt && (
            <span className="text-[9px] font-medium text-neutral-400 dark:text-neutral-500/70 italic">
              (edited)
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="w-full mt-1.5 max-w-3xl animate-in fade-in-50 duration-150">
            <Editor
              placeholder="Edit your message..."
              defaultValue={body}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              disabled={isUpdating}
            />
          </div>
        ) : (
          <div 
            className="text-[14px] leading-[22px] font-normal text-neutral-800 dark:text-neutral-300 prose dark:prose-invert break-words max-w-none text-left tracking-normal ql-editor-display w-full overflow-x-auto scrollbar-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}

        {/* Scaled Media Engine Elements */}
        {image && !isEditing && (
          <div className="relative group/image rounded-xl overflow-hidden object-cover  border-neutral-200/80 dark:border-neutral-800/80 shadow-3xs transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 max-w-[280px] sm:max-w-md w-full mt-1.5">
            <ShowImage storageId={image} />
            {isMe && (
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[11px] font-bold select-none backdrop-blur-xs">
                {isImageProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
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
          <div className="mt-2 rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 max-w-[200px] sm:max-w-[240px] aspect-video w-full relative select-none shadow-3xs transition-all duration-200 bg-neutral-50 dark:bg-neutral-950">
            <Image 
              src={gifUrl} 
              alt="Message attachment asset" 
              fill
              className="object-cover" 
              unoptimized
            />
          </div>
        )}

        {/* Reaction Pill Layout Panel Engine */}
        {!isEditing && (
          <Reaction 
            reactions={reactions} 
            currentMemberId={currentMemberId} 
            onToggle={handleReactionToggle} 
          />
        )}

        {/* Thread Component Response Box Anchor */}
        {threadCount > 0 && !isEditing && (
          <button 
            onClick={() => openPanel(id)}
            className="mt-2.5 flex items-center gap-2 px-2.5 py-1.5 bg-neutral-50/80 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 rounded-lg group/thread text-neutral-500 dark:text-neutral-400 select-none hover:bg-white dark:hover:bg-neutral-950 transition-all duration-150 shadow-3xs hover:shadow-2xs"
          >
            <Avatar className="h-4 w-4 rounded-xs border border-neutral-200 dark:border-neutral-800 shrink-0">
              <AvatarImage src={threadImage} className="rounded-xs object-cover" />
              <AvatarFallback className="rounded-xs text-[8px] font-bold bg-neutral-200 text-neutral-700">
                #
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 group-hover/thread:underline tracking-tight">
              {threadCount} {threadCount === 1 ? "reply" : "replies"}
            </span>
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500/80 tracking-tight hidden sm:inline">
              Last active {new Date(threadTimestamp!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </button>
        )}
      </div>

      {!isEditing && (
        <MsgToolBar
          isMe={isMe}
          isRemoving={isRemoving}
          isImageProcessing={isImageProcessing}
          onReactionToggle={handleReactionToggle}
          onThreadClick={() => openPanel(id)}
          onEditClick={() => setIsEditing(true)}
          onDeleteClick={handleDelete}
          className="absolute right-2 sm:right-5 -top-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-150 ease-out z-30"
        />
      )}
    </div>
  );
}