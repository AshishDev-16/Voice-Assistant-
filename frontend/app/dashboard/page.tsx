"use client";

import { Phone, PhoneMissed, PhoneIncoming, ArrowRight, Gauge } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fetcher = (url: string) => fetch(`${API_URL}${url}`).then(r => r.json());

function UsageBar({ label, used, limit, color }: { label: string; used: number; limit: number; color: string }) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const borderCol = pct > 90 ? 'border-red-500/50' : pct > 70 ? 'border-yellow-500/50' : 'border-white/10';
  const barCol = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : color;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono text-white">
          {used.toLocaleString()} <span className="text-zinc-600">/ {isUnlimited ? '∞' : limit.toLocaleString()}</span>
        </span>
      </div>
      <div className={`w-full bg-black/40 rounded-full h-1.5 border ${borderCol} overflow-hidden`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${isUnlimited ? 10 : pct}%` }}
          className={`${barCol} h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
        />
      </div>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  switch (sentiment) {
    case 'positive': return <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Positive" />;
    case 'negative': return <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" title="Negative" />;
    case 'lead': return <div className="h-1.5 w-1.5 rounded-full bg-maroon-500 shadow-[0_0_8px_rgba(128,0,0,0.5)]" title="Hot Lead" />;
    default: return <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" title="Neutral" />;
  }
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const { data: stats } = useSWR(userId ? `/api/dashboard/stats?businessId=${userId}` : null, fetcher);
  const { data: profile } = useSWR(userId ? `/api/profile?clerkId=${userId}` : null, fetcher);

  const statCards = [
    { label: "Total Voice Traffic", value: stats?.totalCalls ?? "—", icon: Phone, color: "text-maroon-400" },
    { label: "Goal Completion", value: stats?.completedCalls ?? "—", icon: Gauge, color: "text-green-400" },
    { label: "Missed Opportunities", value: stats?.missedCalls ?? "—", icon: PhoneMissed, color: "text-red-400" },
    { label: "Live Active Sessions", value: stats?.inProgressCalls ?? "—", icon: PhoneIncoming, color: "text-yellow-400" },
  ];

  const usage = stats?.usage;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Nerve Center</h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium italic">AgentFlow AI is standing by and attending your business calls.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-400 uppercase tracking-widest animate-pulse">
           <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
           Live Engine Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/5 shadow-2xl group hover:border-maroon-500/30 transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-black/40 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Usage Tracking + Pulse Feed */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Agent Intelligence Pulse */}
        <div className="col-span-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
             <PhoneIncoming className="h-32 w-32 -rotate-12" />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-xl text-white tracking-tight">Intelligence Pulse</h3>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">Real-time AI activity log</p>
            </div>
            <Link href="/dashboard/calls" className="p-2 rounded-full bg-white/5 hover:bg-maroon-500/20 text-maroon-400 transition-all">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3 relative z-10">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              stats.recentCalls.map((call: any, i: number) => (
                <div key={i} className="group/item flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-maroon-500/30 transition-all duration-300">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                    call.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                    call.status === 'missed' ? 'bg-red-500/10 text-red-400' : 
                    'bg-yellow-500/10 text-yellow-400 animate-pulse'
                  }`}>
                    {call.status === 'completed' ? <Phone className="h-4 w-4" /> :
                     call.status === 'missed' ? <PhoneMissed className="h-4 w-4" /> :
                     <div className="flex gap-0.5 h-3 items-end">
                       <div className="w-0.5 h-full bg-yellow-400 animate-[bounce_0.8s_infinite]" />
                       <div className="w-0.5 h-2/3 bg-yellow-400 animate-[bounce_0.8s_infinite_0.2s]" />
                       <div className="w-0.5 h-full bg-yellow-400 animate-[bounce_0.8s_infinite_0.4s]" />
                     </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-white truncate">{call.callerNumber}</p>
                       <SentimentBadge sentiment={call.sentiment} />
                       {call.status === 'in-progress' && (
                         <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-black uppercase tracking-tighter">LIVE</span>
                       )}
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{call.outcome || 'Call in progress...'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-zinc-400">{call.duration ? `${Math.floor(call.duration/60)}:${(call.duration%60).toString().padStart(2,'0')}` : 'LIVE'}</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">{new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.02] flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 opacity-20" />
                </div>
                <p className="text-sm font-bold tracking-tight">Awaiting inbound traffic</p>
                <p className="text-[10px] mt-1 font-medium uppercase tracking-widest opacity-60">Pulse will activate on next call</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Tracking Panel */}
        <div className="col-span-3 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="h-5 w-5 text-maroon-400" />
            <h3 className="font-semibold text-lg text-white">Plan Usage</h3>
          </div>

          {usage ? (
            <div className="space-y-5">
              {/* Plan badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-maroon-900/20 border border-maroon-500/20">
                <span className="text-sm text-zinc-400">Current Plan</span>
                <span className="text-sm font-semibold text-maroon-400 uppercase">{usage.planLabel}</span>
              </div>

              <UsageBar 
                label="Voice Calls" 
                used={usage.callsUsed} 
                limit={usage.callsLimit} 
                color="maroon-500" 
              />
              <UsageBar 
                label="AI Responses" 
                used={usage.aiResponsesUsed} 
                limit={usage.aiResponsesLimit} 
                color="blue-500" 
              />

              <div className="text-xs text-zinc-600 text-right">
                Resets in {usage.daysUntilReset} days
              </div>

              {/* Agent info */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Business Type</span>
                  <span className="text-white capitalize">{profile?.businessType || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Business Hours</span>
                  <span className="text-white">{profile?.businessHours || '—'}</span>
                </div>
              </div>

              <Link 
                href="/dashboard/knowledge"
                className="flex items-center justify-center gap-2 w-full py-3 bg-maroon-800/40 hover:bg-maroon-700/40 text-maroon-400 rounded-xl font-medium transition-all border border-maroon-500/30 text-sm"
              >
                Configure Agent <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
