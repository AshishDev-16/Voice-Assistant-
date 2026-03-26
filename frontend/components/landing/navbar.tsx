"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, ChevronRight, Github } from "lucide-react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
            <Mic className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white uppercase italic">Aion.AI</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest">Capabilities</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest">Pricing</Link>
          <Link
            href="https://github.com/AshishDev-16/Voice-Assistant-"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-widest"
          >
            <Github className="w-4 h-4" />
            <span>Git</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center space-x-2 text-sm font-bold text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 px-5 py-2.5 rounded-xl border border-emerald-500/20 transition-all uppercase tracking-tighter"
              >
                <span>Console</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "h-10 w-10 border-2 border-white/10" } }} />
            </>
          ) : (
            <>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors uppercase tracking-widest px-4">
                  Entry
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-widest border border-white/10">
                  Initialize
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
