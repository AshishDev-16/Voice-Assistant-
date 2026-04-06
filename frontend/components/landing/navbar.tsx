"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ChevronRight, Github } from "lucide-react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[50%] max-w-4xl z-50 rounded-2xl border border-border bg-background/60 backdrop-blur-2xl shadow-xl transition-all duration-300"
    >
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 group cursor-pointer shrink-0">
          <div className="p-1.5 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all shadow-inner">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-black text-base tracking-tighter text-foreground uppercase italic transition-all">Aion AI</span>
        </div>

        {/* Central Links - Hidden on smaller md screens */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          <nav className="flex items-center space-x-4">
            <Link href="#features" className="text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest italic">Features</Link>
            <Link href="#pricing" className="text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest italic">Pricing</Link>
            <Link
              href="https://github.com/AshishDev-16/Voice-Assistant-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest italic"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <ThemeToggle />
          
          <div className="h-4 w-[1px] bg-border mx-0.5" />

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center space-x-1.5 text-[9px] font-black text-white bg-primary hover:scale-105 active:scale-95 px-4 py-2 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
              <UserButton appearance={{ 
                elements: { 
                  userButtonAvatarBox: "h-8 w-8 rounded-lg border border-primary/20 shadow-md",
                  userButtonTrigger: "hover:scale-105 transition-transform"
                } 
              }} />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-[9px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest px-3 h-9">
                  Log In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="h-9 px-4 rounded-xl bg-primary hover:scale-105 active:scale-95 text-white text-[9px] font-black transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
