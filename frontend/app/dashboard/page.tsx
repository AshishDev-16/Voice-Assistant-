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
  const barColor = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : `bg-${color}`;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white font-medium">
          {used.toLocaleString()} / {isUnlimited ? '∞' : limit.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-2.5 border border-white/5">
        <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${isUnlimited ? 5 : pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const { data: stats } = useSWR(userId ? `/api/dashboard/stats?businessId=${userId}` : null, fetcher);
  const { data: profile } = useSWR(userId ? `/api/profile?clerkId=${userId}` : null, fetcher);

  const statCards = [
    { label: "Total Calls", value: stats?.totalCalls ?? "—", icon: Phone, color: "text-maroon-400" },
    { label: "Completed", value: stats?.completedCalls ?? "—", icon: Phone, color: "text-green-400" },
    { label: "Missed", value: stats?.missedCalls ?? "—", icon: PhoneMissed, color: "text-red-400" },
    { label: "In Progress", value: stats?.inProgressCalls ?? "—", icon: PhoneIncoming, color: "text-yellow-400" },
  ];

  const usage = stats?.usage;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">Here&apos;s how your AI Voice Agent is performing today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Usage Tracking + Recent Calls */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Calls */}
        <div className="col-span-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-white">Recent Calls</h3>
            <Link href="/dashboard/calls" className="text-sm text-maroon-400 hover:text-maroon-300 flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              stats.recentCalls.map((call: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    call.status === 'completed' ? 'bg-green-500/10' : call.status === 'missed' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                  }`}>
                    {call.status === 'completed' ? <Phone className="h-4 w-4 text-green-400" /> :
                     call.status === 'missed' ? <PhoneMissed className="h-4 w-4 text-red-400" /> :
                     <PhoneIncoming className="h-4 w-4 text-yellow-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{call.callerNumber}</p>
                    <p className="text-xs text-zinc-500">{call.outcome || call.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">{call.duration ? `${Math.floor(call.duration/60)}:${(call.duration%60).toString().padStart(2,'0')}` : '—'}</p>
                    <p className="text-xs text-zinc-600">{new Date(call.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Phone className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">No calls yet</p>
                <p className="text-xs mt-1">Calls will appear here once your AI agent starts receiving them.</p>
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
