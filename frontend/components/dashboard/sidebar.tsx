"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PhoneCall,
  Package,
  BarChart3,
  Settings,
  Bot,
  Brain,
  CalendarCheck2
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Call Inbox", href: "/dashboard/calls", icon: PhoneCall },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarCheck2 },
  { name: "Agent Config", href: "/dashboard/knowledge", icon: Brain },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <div className="flex h-full w-64 flex-col bg-white/5 backdrop-blur-2xl border-r border-white/10 text-zinc-300 shrink-0">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-maroon-500" />
          <span className="font-bold text-white tracking-tight text-lg">AgentFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-3">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/5",
                  isActive
                    ? "bg-white/10 border border-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive ? "text-maroon-400" : "text-zinc-400")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3">
          {isLoaded && user ? (
            <>
              <div className="shrink-0 flex items-center justify-center">
                <UserButton />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </span>
                <span className="text-xs text-maroon-400 capitalize">
                  {user.publicMetadata?.plan ? `${user.publicMetadata.plan} Plan` : 'No Plan'}
                </span>
              </div>
            </>
          ) : (
            <div className="animate-pulse flex items-center gap-3 w-full">
              <div className="h-8 w-8 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
