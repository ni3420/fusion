"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InviteCardProps {
  workspaceName: string;
  joinCode: string;
  onResetCode: () => Promise<void>;
  isResetting?: boolean;
}

export default function InviteCard({
  workspaceName,
  joinCode,
  onResetCode,
  isResetting = false,
}: InviteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const inviteUrl = `${window.location.origin}/join/${joinCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      
      setCopied(true);
      toast.success("Invitation link copied to clipboard!");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy invitation link.");
    }
  };

  const handleReset = async () => {
    try {
      // Allow parent mutation handles to resolve completely before alerting the UI
      await onResetCode();
    } catch (err) {
      console.error(err);
      toast.error("Failed to rotate access token credentials.");
    }
  };

  return (
    <Card className="max-w-md w-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="space-y-1.5 p-6">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Invite members to {workspaceName}
        </CardTitle>
        <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
          Use the secure access sequence token below to authorize incoming team registration pools.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6">
        {/* Code Visual Display block */}
        <div className="flex flex-col items-center justify-center py-6 px-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl gap-y-3">
          <span className="text-3xl font-black tracking-[0.3em] font-mono pl-[0.3em] uppercase text-neutral-800 dark:text-neutral-100 selection:bg-transparent">
            {joinCode}
          </span>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isResetting}
            onClick={handleCopy}
            className="h-8 text-xs font-semibold px-3 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                Copied Link
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
                Copy Invite Link
              </>
            )}
          </Button>
        </div>

        {/* Rotational Lifecycle Actions panel */}
        <div className="flex items-start gap-3 p-3.5 border border-red-200/40 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 rounded-xl">
          <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-red-900 dark:text-red-400">
                Reset Joining Parameter Key
              </h4>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Resetting deauthorizes all pre-existing link copies instantly. New arrivals will require the updated generated output code.
              </p>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              disabled={isResetting}
              onClick={handleReset}
              className={cn(
                "h-7 text-xs font-bold px-3 text-red-600 dark:text-red-400 hover:bg-red-100/60 dark:hover:bg-red-950/20 rounded-md transition-all",
                isResetting && "opacity-70"
              )}
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  Reset Code
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}