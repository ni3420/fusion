"use client";

import { Edit2, Trash, MessageSquare, Smile, Loader2, Heart, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dynamic from "next/dynamic";
import { MsgToolBarProps } from "../types";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function MsgToolBar({
  isMe,
  isRemoving = false,
  isImageProcessing = false,
  onReactionToggle,
  onEditClick,
  onDeleteClick,
  onThreadClick,
  className,
}: MsgToolBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div 
        className={cn(
          "flex items-center gap-x-0.5 px-1.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md select-none w-fit transition-all duration-100",
          className
        )}
      >
        {/* Quick Reaction: Thumbs Up */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => onReactionToggle("👍")}
            >
              <ThumbsUp className="h-3.5 w-3.5 stroke-[2]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-0 shadow-xs">
            React 👍
          </TooltipContent>
        </Tooltip>

        {/* Quick Reaction: Heart */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => onReactionToggle("❤️")}
            >
              <Heart className="h-3.5 w-3.5 stroke-[2]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-0 shadow-xs">
            React ❤️
          </TooltipContent>
        </Tooltip>

        {/* Full Emoji Catalog Menu Trigger Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Smile className="h-4 w-4 stroke-[2]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-0 shadow-xs">
                  Find a reaction
                </TooltipContent>
              </Tooltip>
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="p-0 border-none bg-transparent shadow-2xl z-50">
            <EmojiPicker 
              onEmojiClick={(emojiData) => onReactionToggle(emojiData.emoji)}
              lazyLoadEmojis={true}
              height={360}
              width={300}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
            />
          </PopoverContent>
        </Popover>
        
        {onThreadClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onThreadClick}
                className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <MessageSquare className="h-4 w-4 stroke-[2]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-0 shadow-xs">
              Reply in thread
            </TooltipContent>
          </Tooltip>
        )}

        {isMe && <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1" />}

        {isMe && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onEditClick} 
                  className="h-7 w-7 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Edit2 className="h-3.5 w-3.5 stroke-[2]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-0 shadow-xs">
                Edit message
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={isRemoving || isImageProcessing}
                  onClick={onDeleteClick} 
                  className="h-7 w-7 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  {isRemoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash className="h-3.5 w-3.5 stroke-[2]" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px] px-2 py-0.5 font-semibold bg-red-600 text-white dark:bg-red-500 dark:text-white border-0 shadow-xs">
                Delete message
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}