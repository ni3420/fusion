"use client";

import { Smile, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import to avoid Next.js SSR document reference errors
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ReactionProps {
  reactions: Array<{ _id: string; value: string; count: number; memberId: string }>;
  currentMemberId: string;
  onToggle: (value: string) => void;
}

export default function Reaction({ reactions, currentMemberId, onToggle }: ReactionProps) {
  
  // Group reactions by their emoji character so count stacks correctly into single buttons
  const aggregatedReactions = useMemo(() => {
    const groups: Record<string, { value: string; count: number; hasReacted: boolean }> = {};
    
    reactions.forEach((rx) => {
      if (!groups[rx.value]) {
        groups[rx.value] = {
          value: rx.value,
          count: 0,
          hasReacted: false,
        };
      }
      // If your backend already delivers aggregated counts, change this to: groups[rx.value].count = rx.count;
      groups[rx.value].count += 1; 
      if (rx.memberId === currentMemberId) {
        groups[rx.value].hasReacted = true;
      }
    });

    return Object.values(groups);
  }, [reactions, currentMemberId]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-1.5 mt-2 select-none justify-start items-center">
        
        {/* Render Aggregated Reaction Pills */}
        {aggregatedReactions.map((rx) => (
          <Tooltip key={rx.value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggle(rx.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl border transition-all duration-200 active:scale-95",
                  rx.hasReacted
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "bg-neutral-50/60 border-neutral-200/60 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-900/40 dark:border-neutral-800/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                )}
              >
                <span className="text-sm leading-none">{rx.value}</span>
                <span 
                  className={cn(
                    "text-[10px] font-bold", 
                    rx.hasReacted ? "text-indigo-500 dark:text-indigo-300" : "text-neutral-400"
                  )}
                >
                  {rx.count}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="text-[10px] font-semibold px-2 py-1 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 rounded-md border-0"
            >
              {rx.hasReacted ? "You reacted" : "Click to react"}
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Master Advanced Emoji Picker Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="inline-flex items-center justify-center h-7 px-2 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all duration-200 opacity-0 group-hover:opacity-100 gap-1"
            >
              <Smile className="h-3.5 w-3.5 stroke-[2]" />
              <Plus className="h-2.5 w-2.5 opacity-60 stroke-[2.5]" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            className="p-0 border-none bg-transparent shadow-2xl z-50 rounded-2xl overflow-hidden"
          >
            <EmojiPicker 
              onEmojiClick={(emojiData) => onToggle(emojiData.emoji)}
              lazyLoadEmojis={true}
              height={380}
              width={320}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
              searchPlaceHolder="Search reactions..."
            />
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}