"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PhoneCall,
  BarChart3,
  Settings,
  Bot,
  Brain,
  Zap
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Call Inbox", href: "/dashboard/calls", icon: PhoneCall },
  { name: "Intelligence Hub", href: "/dashboard/intelligence", icon: Brain },
  { name: "Agent Config", href: "/dashboard/knowledge", icon: Bot },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar-bg backdrop-blur-2xl border-r border-border text-foreground shrink-0 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="flex h-16 items-center px-6 border-b border-border relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all shadow-inner">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-black text-foreground tracking-tighter text-xl uppercase italic">Aion AI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 relative z-10">
        <nav className="flex flex-col gap-1.5 px-3">
          {sidebarLinks
            .filter(link => {
              if (user?.publicMetadata?.plan === 'starter' && link.name === "Intelligence Hub") return false;
              return true;
            })
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all group relative overflow-hidden italic",
                    isActive
                      ? "bg-primary/10 border border-primary/20 text-primary shadow-sm"
                      : "text-muted-foreground/60 hover:bg-primary/5 hover:text-foreground"
                  )}
                >
                   {isActive && (
                      <motion.span layoutId="sidebar-active" className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                   )}
                  <link.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary" : "opacity-40")} />
                  {link.name}
                </Link>
              );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border mt-auto relative z-10 bg-card/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {isLoaded && user ? (
            <>
              <div className="shrink-0 flex items-center justify-center p-0.5 rounded-full border border-primary/20 shadow-xl">
                <UserButton />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-black text-foreground truncate uppercase italic tracking-tight">
                  {user.fullName || "User Node"}
                </span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest italic animate-pulse">
                  {user.publicMetadata?.plan ? `${user.publicMetadata.plan} Plan` : 'Auth Success'}
                </span>
              </div>
            </>
          ) : (
            <div className="animate-pulse flex items-center gap-3 w-full">
              <div className="h-8 w-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded w-1/3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
