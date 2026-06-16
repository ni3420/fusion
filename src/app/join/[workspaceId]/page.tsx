"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Hash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [isPending, setIsPending] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    const lastChar = value.substring(value.length - 1);
    
    if (lastChar && !/^[a-zA-Z0-9]$/.test(lastChar)) return;

    const newCode = [...code];
    newCode[index] = lastChar.toLowerCase();
    setCode(newCode);

    if (lastChar && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (pastedData.length === 6 && /^[a-zA-Z0-9]{6}$/.test(pastedData)) {
      const pastedCode = pastedData.toLowerCase().split("");
      setCode(pastedCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    console.log(fullCode)

    if (fullCode.length !== 6) {
      toast.error("Please enter a complete 6-digit access token.");
      return;
    }

    try {
      setIsPending(true);
      

      toast.success("Workspace access clearance authorized!");
      router.push(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error(error);
      toast.error("Invalid workspace join parameters or token expired.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased select-none">
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hub
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl flex flex-col items-center">
        <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700/60 mb-4">
          <Hash className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </div>

        <div className="space-y-1.5 text-center mb-8">
          <h1 className="text-xl font-bold tracking-tight">Join Workspace</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-normal">
            Enter the secure 6-digit invitation sequence distributed by your workspace administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el!; }}
                type="text"
                maxLength={1}
                value={digit}
                disabled={isPending}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border bg-transparent uppercase",
                  "focus-visible:outline-none focus-visible:ring-1 transition-all",
                  digit 
                    ? "border-neutral-900 dark:border-neutral-100 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100" 
                    : "border-neutral-200 dark:border-neutral-800 focus-visible:ring-neutral-400"
                )}
              />
            ))}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending || code.some((d) => !d)}
              className="w-full h-10 text-xs font-semibold bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Verifying Security Tokens...
                </>
              ) : (
                "Verify Code & Join"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}