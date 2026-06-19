"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Id } from "../../../../convex/_generated/dataModel";
import ThreadPanel from "./thread-panel";

interface ThreadModelProps {
  messageId: Id<"messages"> | null;
  onClose: () => void;
}

export default function ThreadModel({ messageId, onClose }: ThreadModelProps) {
  const isOpen = !!messageId;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="p-0 w-full md:max-w-[420px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 gap-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Message Thread Activity</SheetTitle>
        </SheetHeader>

        {isOpen && (
          <ThreadPanel 
            messageId={messageId} 
            onClose={onClose} 
          />
        )}
      </SheetContent>
    </Sheet>
  );
}