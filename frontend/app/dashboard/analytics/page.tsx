"use client";

import { Phone, PhoneMissed, CheckCircle2, Clock, BarChart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fetcher = (url: string) => fetch(`${API_URL}${url}`).then(r => r.json());

export default function AnalyticsPage() {
  const { userId } = useAuth();
  const { data: stats } = useSWR(userId ? `/api/calls/stats?businessId=${userId}` : null, fetcher);

  const totalCalls = stats?.totalCalls || 0;
  const completedCalls = stats?.completedCalls || 0;
  const missedCalls = stats?.missedCalls || 0;
  const completionRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">Voice agent performance insights powered by real call data.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Calls", value: totalCalls, icon: Phone, color: "maroon" },
          { label: "Completed", value: completedCalls, icon: CheckCircle2, color: "green" },
          { label: "Missed", value: missedCalls, icon: PhoneMissed, color: "red" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: BarChart, color: "blue" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Call Volume Chart Placeholder */}
        <div className="col-span-2 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Call Volume Trends</h3>
            <BarChart className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl text-zinc-500 bg-black/20 backdrop-blur-md shadow-inner">
            <BarChart className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">Charts will populate as calls come in</p>
            <p className="text-xs mt-1 text-zinc-600">Connect your Twilio number to start tracking</p>
          </div>
        </div>

        {/* Outcome Distribution */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Call Outcomes</h3>
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="space-y-4">
            {stats?.recentCalls && stats.recentCalls.length > 0 ? (
              <>
                {['Appointment Booked', 'Order Placed', 'Inquiry', 'No Outcome'].map((outcome, i) => {
                  const count = stats.recentCalls.filter((c: any) => 
                    c.outcome?.toLowerCase().includes(outcome.toLowerCase().split(' ')[0])
                  ).length;
                  const pct = stats.recentCalls.length > 0 ? Math.round((count / stats.recentCalls.length) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">{outcome}</span>
                        <span className="text-white font-medium">{pct}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-2 border border-white/5">
                        <div className="bg-maroon-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
                <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No outcome data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-3 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          {stats?.recentCalls && stats.recentCalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {stats.recentCalls.map((call: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                  <p className="text-sm font-medium text-white truncate">{call.callerNumber}</p>
                  <p className="text-xs text-zinc-500 mt-1">{call.status}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{new Date(call.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-zinc-500">
              <Phone className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">Activity will show here once calls start coming in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
