"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useGetWorkSpaceId } from "../hooks/use-workspace-id";

const sidebarItemVariants = cva(
  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all select-none cursor-pointer group",
  {
    variants: {
      variant: {
        default: "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900/60",
        active: "text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800/80 shadow-3xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SideBarItemProps extends VariantProps<typeof sidebarItemVariants> {
  label: string;
  icon: LucideIcon;
  id: string;
}

export default function SideBarItem({
  label,
  icon: Icon,
  id,
  variant,
}: SideBarItemProps) {
  const workspaceId = useGetWorkSpaceId();

  return (
    <Link 
      href={`/workspaces/${workspaceId}/channels/${id}`}
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Icon className={cn(
        "h-4 w-4 shrink-0 transition-colors",
        variant === "active" 
          ? "text-neutral-900 dark:text-neutral-50" 
          : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
      )} />
      <span className="truncate">{label}</span>
    </Link>
  );
}