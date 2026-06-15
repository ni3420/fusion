"use client";

import { useEffect, useMemo } from "react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workpspaces";
import { useWorkspaceModel } from "@/store/use-workspace-model";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-model";

export default function Home() {
  const [open, setOpen] = useWorkspaceModel();
  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (!workspaceId) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, setOpen]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Main Workspace Engine
      </h1>
      <CreateWorkspaceModal/>
    </div>
  );
}