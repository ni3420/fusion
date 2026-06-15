"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useWorkspaceModel } from "@/store/use-workspace-model";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 characters long" })
    .max(50, { message: "Workspace name cannot exceed 50 characters" }),
});

type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useWorkspaceModel();
  const createWorkspace = useMutation(api.workspaces.create);
  const router=useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    try {
      const workspaceId = await createWorkspace({ name: values.name });
      toast.success("Workspace initialized successfully.");
      handleClose();
      router.push(`/workspaces/${workspaceId}`)
    // window.location.href=`/workspaces/${workspaceId}`
    } catch (error) {
      console.error(error);
      toast.error("Failed to construct workspace parameters.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-lg">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Initialize Workspace
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
            Create an isolated collaboration hub with specialized workspace properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid gap-1.5">
            <Label 
              htmlFor="name" 
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider"
            >
              Workspace Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., planLab Engine, Sprints, DevOps"
              disabled={isSubmitting}
              className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent focus-visible:ring-neutral-400 font-medium"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500 mt-0.5">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleClose}
              className="h-10 border-neutral-200 dark:border-neutral-800 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-4 font-medium bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Hub
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}