"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  BarChart3,
  Settings,
  Bot
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 text-zinc-300 shrink-0">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-emerald-500" />
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <link.icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-zinc-400")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm font-bold">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">John Doe</span>
            <span className="text-xs text-zinc-500">Free Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
