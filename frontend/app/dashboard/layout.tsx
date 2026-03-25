"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const userPlan = user.publicMetadata.plan; 
      if (!userPlan) {
        // User has not paid yet, enforce paywall
        router.push('/#pricing');
      } else if (userPlan === 'starter' && !user.publicMetadata.isOnboarded) {
        // Starter user not onboarded yet
        router.push('/starter-home');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return null;

  const plan = user?.publicMetadata?.plan;
  if (!plan || plan === 'starter') return null; // Avoid UI flashing while Next.js redirects

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-slate-50 selection:bg-maroon-500/30 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-maroon-800/10 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-maroon-500/5 blur-[120px]" />
      </div>

      <div className="flex h-screen w-full relative z-10">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 bg-transparent">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
