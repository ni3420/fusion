"use client";

import { useState } from "react";
import { Trash, Edit2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChannelPreferenceProps {
  initialName: string;
  isAdmin: boolean;
  onUpdate: (newName: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function ChannelPreference({
  initialName,
  isAdmin,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
} : ChannelPreferenceProps) {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === initialName) return;
    
    const cleanedName = name.replace(/\s+/g, "-").toLowerCase();
    try {
      await onUpdate(cleanedName);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full space-y-6 bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-900 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Channel Name
              </h3>
              <p className="text-[11px] font-medium text-neutral-500">
                Modifies the display lookup tag for this stream layout.
              </p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 text-xs font-semibold border-neutral-200 dark:border-neutral-800"
              >
                <Edit2 className="h-3 w-3 mr-1.5 text-neutral-500" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateSubmit} className="space-y-3 pt-1">
              <Input
                disabled={isUpdating}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. plan-discussions"
                maxLength={40}
                className="h-9 text-xs font-medium focus-visible:ring-1 border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => {
                    setName(initialName);
                    setIsEditing(false);
                  }}
                  className="h-8 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating || !name.trim() || name === initialName}
                  className="h-8 text-xs font-bold bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 hover:opacity-90"
                >
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                  ) : null}
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/60 w-fit px-2.5 py-1 rounded-md border border-neutral-200/40 dark:border-neutral-800/60">
              # {initialName}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-900 space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </h4>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Deleting this channel purges all historical metadata text nodes immediately. This action cannot be reversed.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDeleteOpen(true)}
              className="h-8 text-xs font-bold bg-red-600 hover:bg-red-700 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60 border border-transparent dark:border-red-900/40 transition-all"
            >
              <Trash className="h-3.5 w-3.5 mr-1.5" />
              Delete Channel
            </Button>
          </div>
        )}
      </div>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md w-full border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-6 rounded-xl">
          <DialogHeader className="space-y-2">
            <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-1">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Confirm Channel Destruction
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
              Are you absolute sure you want to delete <span className="font-mono font-bold bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded text-neutral-800 dark:text-neutral-200">#{initialName}</span>? This structural alteration clears out all active tracking metrics completely.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setConfirmDeleteOpen(false)}
              className="h-9 text-xs font-bold px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteSubmit}
              className="h-9 text-xs font-bold px-4 bg-red-600 hover:bg-red-700"
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