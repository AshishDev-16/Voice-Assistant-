"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Phone, PhoneIncoming, PhoneMissed, Clock, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CallLog {
  _id: string;
  callerNumber: string;
  duration: number;
  status: string;
  summary: string;
  outcome: string;
  extractedData: Record<string, any>;
  transcript: { role: string; text: string; timestamp: string }[];
  createdAt: string;
}

export default function CallsPage() {
  const { userId } = useAuth();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [stats, setStats] = useState({ totalCalls: 0, completedCalls: 0, missedCalls: 0, inProgressCalls: 0 });

  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      try {
        const [callsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/calls?businessId=${userId}`),
          fetch(`${API_URL}/api/calls/stats?businessId=${userId}`)
        ]);
        if (callsRes.ok) setCalls(await callsRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error("Failed to fetch calls", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Phone className="h-4 w-4 text-green-400" />;
      case 'missed': return <PhoneMissed className="h-4 w-4 text-red-400" />;
      case 'in-progress': return <PhoneIncoming className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default: return <Phone className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Calls", value: stats.totalCalls, icon: Phone, color: "maroon-400" },
          { label: "Completed", value: stats.completedCalls, icon: Phone, color: "green-400" },
          { label: "Missed", value: stats.missedCalls, icon: PhoneMissed, color: "red-400" },
          { label: "In Progress", value: stats.inProgressCalls, icon: PhoneIncoming, color: "yellow-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`h-5 w-5 text-${stat.color}`} />
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-6 h-[calc(100vh-16rem)]">
        {/* Call List */}
        <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Call Inbox</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 text-maroon-400 animate-spin" />
              </div>
            ) : calls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <Phone className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm">No calls yet.</p>
                <p className="text-xs mt-1">Calls will appear here once your AI agent starts receiving them.</p>
              </div>
            ) : (
              calls.map((call) => (
                <button
                  key={call._id}
                  onClick={() => setSelectedCall(call)}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 ${selectedCall?._id === call._id ? 'bg-maroon-900/20 border-l-2 border-l-maroon-500' : ''}`}
                >
                  <div className="shrink-0">{statusIcon(call.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{call.callerNumber}</p>
                    <p className="text-xs text-zinc-500 truncate">{call.outcome || call.status}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-500">{formatDuration(call.duration)}</p>
                    <p className="text-xs text-zinc-600">{new Date(call.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Call Detail Panel */}
        <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
          {selectedCall ? (
            <>
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedCall.callerNumber}</h3>
                    <p className="text-xs text-zinc-500">{new Date(selectedCall.createdAt).toLocaleString()} · {formatDuration(selectedCall.duration)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCall.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    selectedCall.status === 'missed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedCall.status}
                  </span>
                </div>
              </div>

              {/* Summary & Extracted Data */}
              {selectedCall.summary && (
                <div className="p-4 border-b border-white/5">
                  <h4 className="text-xs font-semibold text-maroon-400 uppercase tracking-wider mb-2">AI Summary</h4>
                  <p className="text-sm text-zinc-300">{selectedCall.summary}</p>
                </div>
              )}

              {selectedCall.extractedData && Object.keys(selectedCall.extractedData).length > 0 && (
                <div className="p-4 border-b border-white/5">
                  <h4 className="text-xs font-semibold text-maroon-400 uppercase tracking-wider mb-2">Extracted Data</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedCall.extractedData).map(([key, value]) => (
                      <div key={key} className="p-2 rounded-lg bg-black/20">
                        <p className="text-xs text-zinc-500 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-white font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                <h4 className="text-xs font-semibold text-maroon-400 uppercase tracking-wider mb-2">Transcript</h4>
                {selectedCall.transcript.length > 0 ? selectedCall.transcript.map((entry, i) => (
                  <div key={i} className={`flex ${entry.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      entry.role === 'ai'
                        ? 'bg-maroon-900/30 text-zinc-200 rounded-bl-none'
                        : 'bg-white/10 text-white rounded-br-none'
                    }`}>
                      {entry.text}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-600 italic">No transcript available for this call.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <Phone className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Select a call to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
