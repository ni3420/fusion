"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Hash, Trash, Edit2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRenameChannel } from "../api/use-rename-channel";
import { useDeleteChannel } from "../api/use-delete-channel";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChannelHeaderProps {
  name: string;
  channelId: Id<"channels">;
  isAdmin: boolean;
}

export default function ChannelHeader({
  name,
  channelId,
  isAdmin,
}: ChannelHeaderProps) {
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(name);

  const { mutate: renameChannel, isPending: isRenaming } = useRenameChannel();
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteChannel();

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === name) return;

    await renameChannel(
      { id: channelId, name: newName },
      {
        onSuccess: () => {
          toast.success("Channel renamed successfully");
          setRenameOpen(false);
        },
        onError: () => {
          toast.error("Failed to rename channel");
        },
      }
    );
  };

  const handleDeleteSubmit = async () => {
    await deleteChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully");
          setDeleteOpen(false);
          router.push(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 select-none">
        <div className="flex items-center gap-1 min-w-0">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 p-1.5 px-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 max-w-[200px] sm:max-w-[400px] justify-start focus-visible:ring-0 outline-none transition-all"
              >
                <Hash className="h-4.5 w-4.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
                <span className="truncate">{name}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="bottom"
              sideOffset={6}
              className="w-56 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-md z-30"
            >
              <div className="px-2.5 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                Channel Actions
              </div>

              <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />

              <DropdownMenuItem
                onClick={() => {
                  setNewName(name);
                  setRenameOpen(true);
                }}
                className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:text-neutral-900 dark:focus:text-neutral-100 cursor-pointer transition-colors"
              >
                <Edit2 className="h-4 w-4 text-neutral-400" />
                Rename Channel
              </DropdownMenuItem>

              {isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />
                  
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-700 dark:focus:text-red-300 cursor-pointer transition-colors"
                  >
                    <Trash className="h-4 w-4 text-red-400 dark:text-red-500" />
                    Delete Channel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] mx-auto border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Rename Channel
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit} className="space-y-4 pt-2">
            <Input
              disabled={isRenaming}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. production-logs"
              maxLength={40}
              required
              className="h-9 text-xs font-medium focus-visible:ring-1 border-neutral-200 dark:border-neutral-800 bg-transparent"
            />
            <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isRenaming}
                onClick={() => setRenameOpen(false)}
                className="h-8 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isRenaming || !newName.trim() || newName === name}
                className="h-8 text-xs font-bold bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 hover:opacity-90"
              >
                {isRenaming && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] mx-auto border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 rounded-xl">
          <DialogHeader className="space-y-2">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-1">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Delete Channel
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
              Are you sure you want to delete <span className="font-mono font-bold bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded text-neutral-800 dark:text-neutral-200">#{name}</span>? This structural alteration clears out all historical tracking logs completely.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
              className="h-9 text-xs font-bold px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSubmit}
              className="h-9 text-xs font-bold px-4 bg-red-600 hover:bg-red-700 dark:bg-red-950 dark:text-red-400"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Purging...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}