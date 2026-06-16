"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UseConfirmProps {
  title: string;
  message: string;
  variant?: "default" | "destructive";
}

export function useConfirm({
  title,
  message,
  variant = "default",
}: UseConfirmProps): [() => JSX.Element, () => Promise<boolean>] {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent className="w-[92%] sm:max-w-md rounded-xl bg-white dark:bg-neutral-900 p-5 border-neutral-200 dark:border-neutral-800 gap-y-4 animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="gap-y-1 text-left">
          <DialogTitle className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="w-full sm:w-auto text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 h-9"
          >
            Cancel
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            className={`w-full sm:w-auto text-xs font-semibold rounded-lg h-9 shadow-xs transition-all active:scale-[0.98] ${
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            }`}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
}