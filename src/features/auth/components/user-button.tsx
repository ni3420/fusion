"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { LogOut, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "../api/use-current-user";

export default function UserButton() {
  const { signOut } = useAuthActions();
  const { isLoading: authLoading } = useConvexAuth();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      window.location.href = "/auth";
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email, image } = user;
  const avatarFallback = name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative cursor-pointer select-none rounded-full group">
        <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 transition group-hover:opacity-85">
          <AvatarImage alt={name || "User Avatar"} src={image} className="object-cover" />
          <AvatarFallback className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-semibold text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-md" align="end" sideOffset={8}>
        <DropdownMenuLabel className="px-2.5 py-2 flex flex-col min-w-0">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {name || "User Node"}
          </span>
          <span className="text-xs text-neutral-400 font-medium truncate mt-0.5">
            {email}
          </span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />
        
        <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg text-neutral-500 dark:text-neutral-400 focus:bg-neutral-50 dark:focus:bg-neutral-800 focus:text-neutral-900 dark:focus:text-neutral-100 cursor-default select-none transition-colors">
          <User className="h-4 w-4 shrink-0" />
          Account Parameters
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg text-red-500 hover:text-red-600 focus:bg-red-50/60 dark:focus:bg-red-950/20 dark:hover:text-red-400 focus:text-red-600 cursor-pointer select-none transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out Pipeline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}