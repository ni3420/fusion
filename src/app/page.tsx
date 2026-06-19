"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workpspaces";
import { useWorkspaceModel } from "@/store/use-workspace-model";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-model";
import { Loader2, Layers, Sparkles, Shield, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useWorkspaceModel();
  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.push(`/workspaces/${workspaceId}`);
    } else {
      setOpen(true);
    }
  }, [workspaceId, isLoading, setOpen, router]);

  if (isLoading || workspaceId) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-y-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
        <p className="text-xs font-medium text-muted-foreground tracking-tight animate-pulse">
          Initializing core workspace configuration parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden flex flex-col justify-between selection:bg-primary/10 antialiased">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-b border-border/40 relative z-10">
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20">
            <Layers className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">Fusion</span>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="sm" className="text-xs font-semibold rounded-lg text-muted-foreground hover:text-foreground">
            Documentation
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center relative z-10 py-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[11px] font-bold tracking-tight mb-6 animate-fade-in select-none">
          <Sparkles className="w-3 h-3 stroke-[2.5]" />
          Engine Operational Matrix v2.4
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight max-w-3xl leading-[1.1] mb-6">
          Architect your workspace ecosystem with micro-precision.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed mb-8">
          A secure real-time architecture engineered for distributed channels, real-time message mutation states, and dynamic asset management.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => setOpen(true)}
            size="lg" 
            className="w-full sm:w-auto rounded-xl font-bold text-xs gap-x-2 shadow-md shadow-primary/10 active:scale-[0.98] transition-transform"
          >
            Launch Studio Context
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto rounded-xl font-semibold text-xs border-border/60 bg-background/50 backdrop-blur-xs hover:bg-muted"
          >
            Review Audit Telemetry
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-16 text-left select-none">
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md flex flex-col gap-y-2">
            <Zap className="w-4 h-4 text-primary stroke-[2.5]" />
            <h3 className="text-xs font-bold text-foreground">Reactive State Synchronization</h3>
            <p className="text-[11px] text-muted-foreground leading-normal">Deterministic reactive pipelines powered by global engine schemas.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md flex flex-col gap-y-2">
            <Shield className="w-4 h-4 text-indigo-500 stroke-[2.5]" />
            <h3 className="text-xs font-bold text-foreground">Cryptographic Isolation</h3>
            <p className="text-[11px] text-muted-foreground leading-normal">Complete environment variable validation protocols for total workspace parameters safety.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md flex flex-col gap-y-2">
            <Layers className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
            <h3 className="text-xs font-bold text-foreground">Elastic Channel Scalability</h3>
            <p className="text-[11px] text-muted-foreground leading-normal">Infinite sub-thread matrix deployment with automated bucket memory allocations.</p>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 h-12 flex items-center justify-between border-t border-border/40 text-[10px] font-medium text-muted-foreground/60 relative z-10 select-none">
        <span>© 2026 Fusion All rights reserved.</span>
      </footer>

      <CreateWorkspaceModal/>
    </div>
  );
}