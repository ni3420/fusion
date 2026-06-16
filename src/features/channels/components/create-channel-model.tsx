"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Hash } from "lucide-react";
import { useGetWorkSpaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateChannel } from "../api/use-create-channels";
import { useCreateChannelModal } from "../hooks/use-create-model";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


const channelSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Channel name must be at least 3 characters long" })
    .max(80, { message: "Channel name must be under 80 characters" })
    .transform((val) => val.replace(/\s+/g, "-").toLowerCase()),
});

type ChannelFormValues = z.infer<typeof channelSchema>;

export default function CreateChannelModal() {
  const router = useRouter();
  const workspaceId = useGetWorkSpaceId();
  const [open,setOpen]=useCreateChannelModal()
  
  // Destructure custom API mutate function and loading state
  const { mutate, isPending } = useCreateChannel();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (values: ChannelFormValues) => {
    await mutate(
      {
        name: values.name,
        workspaceId,
      },
      {
        onSuccess: (channelId) => {
          toast.success("Communication channel initialized successfully!");
          handleClose();
          router.push(`/workspace/${workspaceId}/channels/${channelId}`);
        },
        onError: () => {
          toast.error("Failed to compile and create target channel route.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-6 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-900 rounded-xl shadow-lg">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Hash className="h-4 w-4 text-neutral-400" />
            Create a channel
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
            Channels are where your team communicates. They are best when organized around a topic — #marketing, for example.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="channel-name" className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Channel Name
            </Label>
            <div className="relative flex items-center">
              <Hash className="absolute left-3 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
              <Input
                id="channel-name"
                type="text"
                disabled={isPending}
                placeholder="e.g. plan-discussions"
                className="h-9 pl-9 text-xs border-neutral-200 dark:border-neutral-800 bg-transparent focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:ring-offset-0"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-x-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={handleClose}
              className="h-8 text-xs font-semibold px-4 border border-neutral-200 dark:border-neutral-800 rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-8 text-xs font-semibold px-4 bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-md shadow-xs transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Channel"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}