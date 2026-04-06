"use client";

import { Bell, Search, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/50 backdrop-blur-3xl px-6 shrink-0 z-20 shadow-sm transition-colors duration-500">
      <div className="flex items-center w-full max-w-sm">
        <div className="relative w-full group">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search Protocol..."
            className="h-10 w-full rounded-xl border border-border bg-background/40 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner italic"
          /> */}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 border border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/20 transition-all group">
          <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-primary border border-background shadow-lg shadow-primary/40 animate-pulse"></span>
        </button>

        <div className="h-4 w-[1px] bg-border mx-2" />
        
        <div className="flex items-center gap-3 pl-1">
           <UserButton appearance={{ 
              elements: { 
                userButtonAvatarBox: "h-8 w-8 rounded-lg border border-primary/20 shadow-md",
                userButtonTrigger: "hover:scale-105 transition-transform"
              } 
            }} />
        </div>
      </div>
    </header>
  );
}
