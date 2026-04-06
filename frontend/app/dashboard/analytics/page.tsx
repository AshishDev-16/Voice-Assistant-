"use client";

import { Phone, PhoneMissed, CheckCircle2, Clock, BarChart, Zap, Activity, Lock, ArrowRight } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AnalyticsPage() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();

  const fetcher = async (url: string) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}${url}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  };

  const { data: stats } = useSWR(userId ? `/api/calls/stats?businessId=${userId}` : null, fetcher);

  const isStarter = user?.publicMetadata?.plan === "starter";

  if (isStarter) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
          <div className="w-24 h-24 rounded-[32px] bg-card border-2 border-border flex items-center justify-center relative shadow-2xl group transition-all hover:scale-105 active:scale-95">
             <Lock className="h-10 w-10 text-primary group-hover:rotate-12 transition-all" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase italic mb-3">Enterprise Dashboard Required</h2>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic max-w-md leading-relaxed">
          The <span className="text-primary italic underline underline-offset-4 decoration-primary/20">Analytical Intelligence Layer</span> is exclusive to the Pro and Enterprise tiers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-12">
          <div className="p-6 rounded-3xl bg-card border border-border text-left group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground italic">Conversion Data</span>
            </div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-60">
              Track successful AI-handled bookings and order completions in real-time.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-card border border-border text-left group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground italic">Lead Scoring</span>
            </div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed opacity-60">
              Identify and prioritize high-value callers using AI sentiment mapping.
            </p>
          </div>
        </div>

        <Link href="/#pricing">
          <Button className="h-16 px-12 rounded-2xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl">
            Upgrade Your Plan <ArrowRight className="ml-4 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const totalCalls = stats?.totalCalls || 0;
  const completedCalls = stats?.completedCalls || 0;
  const missedCalls = stats?.missedCalls || 0;
  const completionRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 p-4 md:p-6 bg-background min-h-screen transition-colors duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-3 uppercase italic">
            <Activity className="h-7 w-7 text-primary" />
            Analytics Hub
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 font-black uppercase tracking-[0.2em] italic opacity-60">
            Live Stream Data · Performance Matrix · Conversion Scoring
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Calls", value: totalCalls, icon: Phone, color: "text-primary" },
          { label: "Completed", value: completedCalls, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Missed", value: missedCalls, icon: PhoneMissed, color: "text-rose-500" },
          { label: "Conversion", value: `${completionRate}%`, icon: BarChart, color: "text-blue-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl glass-card relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-background/50 border border-border`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-foreground tracking-tighter italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Call Volume Chart Placeholder */}
        <div className="col-span-1 md:col-span-2 rounded-2xl border-2 border-border glass-card p-6 shadow-xl bg-card/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 italic">
              <BarChart className="h-4 w-4 text-primary" /> Call Volume Trends
            </h3>
            <span className="text-[9px] font-black text-muted-foreground uppercase opacity-40">Live Protocol</span>
          </div>
          <div className="h-[280px] w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground bg-background/20 relative overflow-hidden group">
            <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
            <BarChart className="h-10 w-10 mb-4 opacity-10 animate-pulse text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Awaiting Data Stream</p>
            <p className="text-[8px] mt-2 font-black uppercase tracking-widest opacity-40 italic text-center max-w-[200px]">Connect your infrastructure to initiate telemetry stream.</p>
          </div>
        </div>

        {/* Outcome Distribution */}
        <div className="rounded-2xl border-2 border-border glass-card p-6 shadow-xl bg-card/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 italic">
              <Zap className="h-4 w-4 text-primary" /> Outcomes
            </h3>
            <Clock className="h-4 w-4 text-muted-foreground opacity-40" />
          </div>
          <div className="space-y-5">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              <>
                {['Appointment Booked', 'Order Placed', 'Inquiry', 'No Outcome'].map((outcome, i) => {
                  const count = stats.recentCalls.filter((c: any) => 
                    c.outcome?.toLowerCase().includes(outcome.toLowerCase().split(' ')[0])
                  ).length;
                  const pct = stats.recentCalls.length > 0 ? Math.round((count / stats.recentCalls.length) * 100) : 0;
                  return (
                    <div key={i} className="group/item">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 italic">
                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">{outcome}</span>
                        <span className="text-primary">{pct}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="bg-primary h-full rounded-full" 
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-40 italic">
                <CheckCircle2 className="h-10 w-10 mb-4 text-muted-foreground/20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Protocol Null</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Mini-Stream */}
        <div className="col-span-1 md:col-span-3 rounded-2xl border-2 border-border glass-card p-6 shadow-xl bg-card/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 italic">
              <Clock className="h-4 w-4 text-primary" /> Live Activity Stream
            </h3>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 italic">LIVE_FEED</span>
          </div>
          {stats?.recentCalls && stats.recentCalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {stats.recentCalls.map((call: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-background/50 border border-border group hover:border-primary/40 transition-all">
                  <p className="text-xs font-black text-foreground italic tracking-tight mb-1 truncate">{call.callerNumber}</p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-2">{call.status}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                    <span className="text-[8px] font-black text-muted-foreground/40 italic">{new Date(call.createdAt).toLocaleDateString()}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center opacity-40 italic text-center">
              <Phone className="h-8 w-8 mb-4 text-muted-foreground/20 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Live Telemetry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
