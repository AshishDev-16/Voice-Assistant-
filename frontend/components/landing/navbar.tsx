"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight text-white">AgentFlow</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">Features</Link>
          <Link href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">Pricing</Link>

          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/10 hidden sm:block"
              >
                Go to Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-500/20">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
