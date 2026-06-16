"use client";

import { useState } from "react";
import { SlidersHorizontal, Trash2, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "../components/confirm";
import { useUpdateWorkspace } from "../api/use-upadte-workpspace";
import { useRemoveWorkspace } from "../api/use-remove-workspace";
import { useGetWorkSpaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface PreferenceProps {
  initialData: {
    name: string;
  };
}

export default function Preference({ initialData }: PreferenceProps) {
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  const [name, setName] = useState(initialData.name);

  const { execute: updateWorkspace, isLoading: isUpdating } = useUpdateWorkspace();
  const { execute: removeWorkspace, isLoading: isRemoving } = useRemoveWorkspace();

  const [DeletionDialog, confirmDelete] = useConfirm({
    title: "Teardown Workspace Architecture?",
    message: "This operational instruction is absolute. All database records and synced tracks will be permanently erased.",
    variant: "destructive",
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    try {
      await removeWorkspace({ id: workspaceId });
      router.replace("/");
    } catch (err) {
      console.error("Failed to teardown infrastructure:", err);
    }
  };

  const handleSaveSettings = async () => {
    if (!name.trim() || isUpdating) return;

    try {
      await updateWorkspace({
        id: workspaceId,
        name: name.trim(),
      });
    } catch (err) {
      console.error("Failed to commit settings state:", err);
    }
  };

  const isPending = isUpdating || isRemoving;
  const isSaveDisabled = isPending || !name.trim() || name === initialData.name;

  return (
    <>
      <DeletionDialog />

      <div className="w-full max-w-md mx-auto space-y-5 p-4 select-none bg-white dark:bg-neutral-950">
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
          <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
          <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Workspace Parameters
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              disabled={isPending}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 h-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-2.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-400 dark:focus:border-neutral-700 transition-all disabled:opacity-50"
              placeholder="Workspace Display Name"
            />
            <Button
              size="sm"
              onClick={handleSaveSettings}
              disabled={isSaveDisabled}
              className="h-8 text-xs font-semibold px-3 bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-md shrink-0 shadow-3xs"
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Update
                </>
              )}
            </Button>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="h-7 text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-all px-2"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Dropping space...
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Drop Workspace
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}