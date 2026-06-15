"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FiHome, FiMessageSquare, FiBell, FiGrid, FiEdit3 } from "react-icons/fi";
import WorkSpaceSwitcher from "./workspace-switcher";
import UserButton from "@/features/auth/components/user-button";

export default function SideBar() {
  const pathname = usePathname();

  const routes = useMemo(() => [
    { icon: FiHome, label: "Home", href: "/", active: pathname === "/" },
    { icon: FiMessageSquare, label: "DMs", href: "/dms", active: pathname.startsWith("/dms") },
    { icon: FiBell, label: "Activity", href: "/activity", active: pathname === "/activity" },
    { icon: FiGrid, label: "More", href: "/more", active: pathname === "/more" },
  ], [pathname]);

  return (
    <aside className="w-[84px] h-min-screen bg-white dark:bg-neutral-950 flex flex-col items-center py-6 shrink-0 border-r border-neutral-200 dark:border-neutral-900 select-none relative z-30 justify-between">
      <div className="flex flex-col items-center gap-y-7 w-full">
        <div className="relative flex items-center justify-center w-full group">
          <WorkSpaceSwitcher />
          <div className="absolute left-0 w-1 h-6 bg-neutral-900 dark:bg-white rounded-r-full scale-0 group-hover:scale-100 transition-all duration-200" />
        </div>

        <nav className="flex flex-col items-center gap-y-4 w-full px-2.5">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link 
                key={route.href} 
                href={route.href} 
                className="w-full relative flex items-center justify-center group"
              >
                <div 
                  className={`absolute left-0 w-1 bg-neutral-900 dark:bg-neutral-200 rounded-r-full transition-all duration-200 ${
                    route.active ? "h-7 scale-100" : "h-3 scale-0 group-hover:scale-100 group-hover:h-5"
                  }`} 
                />
                
                <button
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-y-1.5 transition-all duration-200 relative outline-none border ${
                    route.active
                      ? "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${route.active ? "stroke-[2.2]" : "stroke-[1.8]"}`} />
                  <span className="text-xs font-semibold tracking-tight">
                    {route.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-y-6 w-full px-2.5">
        <button
          className="w-14 h-14 rounded-xl bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center outline-none group"
        >
          <FiEdit3 className="h-5 w-5 stroke-[2] transition-transform duration-200 group-hover:rotate-3" />
        </button>

        <div className="w-10 h-px bg-neutral-200 dark:bg-neutral-900" />

        <div className="relative flex items-center justify-center w-full">
          <UserButton />
        </div>
      </div>
    </aside>
  );
}