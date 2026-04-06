"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, PhoneMissed, PhoneIncoming, ArrowRight, Gauge, Brain, Target, ShieldCheck, Zap } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import { Launchpad } from "@/components/dashboard/launchpad";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function UsageBar({ label, used, limit, color }: { label: string; used: number; limit: number; color: string }) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const borderCol = pct > 90 ? 'border-destructive/50' : pct > 70 ? 'border-amber-500/50' : 'border-border';
  const barCol = pct > 90 ? 'bg-destructive' : pct > 70 ? 'bg-amber-500' : color;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{label}</span>
        <span className="text-xs font-mono text-foreground font-bold">
          {used.toLocaleString()} <span className="text-muted-foreground font-medium">/ {isUnlimited ? '∞' : limit.toLocaleString()}</span>
        </span>
      </div>
      <div className={`w-full bg-background/50 rounded-full h-2 border ${borderCol} overflow-hidden shadow-inner`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${isUnlimited ? 10 : pct}%` }}
          className={`${barCol} h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.1)]`} 
        />
      </div>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  switch (sentiment) {
    case 'positive': return <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Positive" />;
    case 'negative': return <div className="h-1.5 w-1.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" title="Negative" />;
    case 'lead': return <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" title="Hot Lead" />;
    default: return <div className="h-1.5 w-1.5 rounded-full bg-slate-500" title="Neutral" />;
  }
}

export default function DashboardPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const fetcher = async (url: string) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}${url}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  };
  
  const { data: stats } = useSWR(userId ? `/api/dashboard/stats?businessId=${userId}` : null, fetcher);
  const { data: profile } = useSWR(userId ? `/api/profile?clerkId=${userId}` : null, fetcher);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
      return;
    }

    if (isLoaded && user) {
      const plan = user.publicMetadata?.plan;
      const isOnboarded = user.publicMetadata?.isOnboarded;

      if (!plan) {
        router.push("/#pricing");
        return;
      }

      if (isOnboarded === false) {
        router.push("/onboarding");
        return;
      }
    }
  }, [isLoaded, userId, user, router]);

  const statCards = [
    { label: "Total Calls", value: stats?.totalCalls ?? "—", icon: Brain, color: "text-primary" },
    { label: "Completed Calls", value: stats?.completedCalls ?? "—", icon: Gauge, color: "text-emerald-500" },
    { label: "Missed Calls", value: stats?.missedCalls ?? "—", icon: Target, color: "text-primary" },
    { label: "Active Calls", value: stats?.inProgressCalls ?? "—", icon: PhoneIncoming, color: "text-amber-500" },
  ];

  const usage = stats?.usage;

  const isStarterZeroState = 
    user?.publicMetadata?.plan === 'starter' && 
    (stats?.totalCalls === 0 || !stats?.totalCalls);

  if (isStarterZeroState) {
    return (
      <div className="p-6 h-screen overflow-hidden flex flex-col bg-background transition-colors duration-700">
        <Launchpad 
          businessName={profile?.businessName || "Your Business"} 
          twilioNumber={profile?.twilioPhoneNumber || "+91-XXX-XXX-XXXX"} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-6 flex flex-col min-h-screen bg-background transition-colors duration-700">
      <div className="flex justify-between items-end gap-6 mb-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <ShieldCheck className="h-5 w-5 text-primary" />
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">System Active</p>
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-foreground italic uppercase underline decoration-primary/20 decoration-4 underline-offset-8">
            {profile?.businessName || 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-inner italic">
           <Zap className="h-4 w-4 animate-pulse" /> System Status: Active
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[40px] glass-card shadow-xl group hover:border-primary/40 transition-all duration-700 border-2 border-border"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-5 rounded-[24px] bg-primary/5 ${stat.color} group-hover:scale-110 transition-transform mb-6 shadow-inner border border-primary/10`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic mb-4">{stat.label}</span>
              <p className="text-5xl font-black text-foreground tracking-tighter italic">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 flex-1 min-h-0">
        {/* Agent Intelligence Pulse */}
        <div className="col-span-4 rounded-[48px] glass-card p-10 shadow-2xl relative overflow-hidden group border-2 border-border flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
             <Brain className="h-48 w-48 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-10 relative z-10 shrink-0">
            <div>
              <h3 className="font-black text-3xl text-foreground tracking-tighter uppercase italic">Recent Activity</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-2 italic">Real-time Call Logs</p>
            </div>
            <Link href="/dashboard/intelligence" className="h-14 w-14 rounded-2xl bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground transition-all shadow-sm flex items-center justify-center border border-primary/10">
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
          <div className="space-y-4 relative z-10 overflow-auto scrollbar-hide pr-2">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              stats.recentCalls.map((call: any, i: number) => (
                <div key={i} className="group/item flex items-center gap-6 p-6 rounded-[32px] bg-background/50 border-2 border-border/50 hover:border-primary/40 hover:bg-background transition-all duration-500 shadow-sm">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-inner border-2 ${
                    call.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                    call.status === 'missed' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 
                    'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    {call.status === 'completed' ? <Phone className="h-6 w-6" /> :
                     call.status === 'missed' ? <PhoneMissed className="h-6 w-6" /> :
                     <div className="flex gap-1 h-5 items-end">
                       <div className="w-1.5 h-full bg-amber-500 animate-[bounce_0.8s_infinite]" />
                       <div className="w-1.5 h-2/3 bg-amber-500 animate-[bounce_0.8s_infinite_0.2s]" />
                       <div className="w-1.5 h-full bg-amber-500 animate-[bounce_0.8s_infinite_0.4s]" />
                     </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <p className="text-lg font-black text-foreground tracking-tighter italic">{call.callerNumber}</p>
                       <SentimentBadge sentiment={call.sentiment} />
                       {call.status === 'in-progress' && (
                         <span className="text-[10px] px-3 py-0.5 rounded-full bg-amber-500 text-black font-black uppercase tracking-tighter italic animate-pulse">LIVE NODE</span>
                       )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-bold italic line-clamp-1 leading-relaxed">{call.outcome || 'Neural stream currently active...'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-foreground font-black tracking-tight">{call.duration ? `${Math.floor(call.duration/60)}:${(call.duration%60).toString().padStart(2,'0')}` : 'SYNC'}</p>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1.5 opacity-60 italic">{new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30">
                <Brain className="h-16 w-16 mb-6 opacity-[0.05]" />
                <p className="text-xs font-black tracking-[0.5em] text-foreground/40 uppercase italic">No Recent Calls</p>
                <p className="text-[9px] mt-3 font-black uppercase tracking-widest opacity-30 italic">Awaiting your first AI-handled communication.</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Tracking Panel */}
        <div className="col-span-3 rounded-[48px] glass-card p-10 shadow-2xl transition-all duration-700 hover:border-primary/20 border-2 border-border flex flex-col">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-border">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-black text-2xl text-foreground italic uppercase tracking-tighter">Plan Usage</h3>
          </div>

          {usage ? (
            <div className="space-y-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/5 border-2 border-primary/10 shadow-inner">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Operational Tier</span>
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">{usage.planLabel}</span>
              </div>

              <div className="space-y-8 mt-4">
                <UsageBar 
                  label="Call Minutes" 
                  used={usage.callsUsed} 
                  limit={usage.callsLimit} 
                  color="bg-primary" 
                />
                <UsageBar 
                  label="AI Responses" 
                  used={usage.aiResponsesUsed} 
                  limit={usage.aiResponsesLimit} 
                  color="bg-primary/80" 
                />
              </div>

              <div className="text-[10px] text-muted-foreground font-black text-center uppercase tracking-[0.5em] italic mt-auto py-6 opacity-40">
                Cycle Reset in {usage.daysUntilReset}D
              </div>

              <div className="space-y-4 p-6 rounded-3xl bg-card/10 border border-border shadow-inner mt-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-widest">
                  <span className="text-muted-foreground/60">Business ID</span>
                  <span className="text-foreground truncate max-w-[120px]">{profile?.clerkId?.slice(-8) || profile?.businessId || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase italic tracking-widest">
                  <span className="text-muted-foreground/60">Sector</span>
                  <span className="text-foreground">{profile?.businessType || 'General'}</span>
                </div>
              </div>

              <Link 
                href="/dashboard/knowledge"
                className="group flex items-center justify-center gap-4 w-full h-18 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/30 mt-8"
              >
                Agent Settings <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6 animate-pulse">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-14 bg-muted/20 rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
