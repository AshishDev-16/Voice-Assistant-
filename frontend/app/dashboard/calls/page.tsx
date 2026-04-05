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
  sentiment?: string;
  recordingUrl?: string;
  extractedData: Record<string, any>;
  transcript: { role: string; text: string; timestamp: string }[];
  createdAt: string;
}

export default function CallsPage() {
  const { userId, getToken } = useAuth();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({ totalCalls: 0, completedCalls: 0, missedCalls: 0, inProgressCalls: 0 });

  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      try {
        const token = await getToken();
        const headers = { "Authorization": `Bearer ${token}` };
        const [callsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/calls?businessId=${userId}`, { headers }),
          fetch(`${API_URL}/api/calls/stats?businessId=${userId}`, { headers })
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

  const SentimentBadge = ({ sentiment }: { sentiment?: string }) => {
    switch (sentiment) {
      case 'positive': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium">Positive</span>;
      case 'negative': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 font-medium">Negative</span>;
      case 'lead': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-500/20 text-maroon-400 border border-maroon-500/20 font-medium uppercase font-bold tracking-tighter shadow-[0_0_10px_rgba(128,0,0,0.2)]">HOT LEAD</span>;
      default: return <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-500/20 font-medium">Neutral</span>;
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Calls", value: stats.totalCalls, icon: Phone, color: "text-maroon-400" },
          { label: "Completed", value: stats.completedCalls, icon: Phone, color: "text-green-400" },
          { label: "Missed", value: stats.missedCalls, icon: PhoneMissed, color: "text-red-400" },
          { label: "In Progress", value: stats.inProgressCalls, icon: PhoneIncoming, color: "text-yellow-400" },
        ].map((stat, i) => (
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
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-6 h-[calc(100vh-16rem)]">
        {/* Call List */}
        <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Call Inbox</h2>
          </div>
          <div className="flex-1 overflow-auto bg-black/10">
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
                  className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 ${selectedCall?._id === call._id ? 'bg-maroon-900/10 border-l-2 border-l-maroon-500' : ''}`}
                >
                  <div className="shrink-0">{statusIcon(call.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white truncate">{call.callerNumber}</p>
                      <SentimentBadge sentiment={call.sentiment} />
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{call.outcome || call.status}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-400 font-mono">{formatDuration(call.duration)}</p>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-tighter mt-0.5">{new Date(call.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Call Detail Panel */}
        <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
          {selectedCall ? (
            <>
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-maroon-900/40 text-maroon-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedCall.callerNumber}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <Clock className="h-3 w-3 text-zinc-500" />
                         <p className="text-xs text-zinc-500">{new Date(selectedCall.createdAt).toLocaleString()} · {formatDuration(selectedCall.duration)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <SentimentBadge sentiment={selectedCall.sentiment} />
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      selectedCall.status === 'completed' ? 'border-green-500/30 text-green-400' :
                      selectedCall.status === 'missed' ? 'border-red-500/30 text-red-400' :
                      'border-yellow-500/30 text-yellow-400'
                    }`}>
                      {selectedCall.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Mock Playback UI */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 ring-1 ring-white/5">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 rounded-full bg-maroon-700 hover:bg-maroon-600 text-white transition-all shadow-[0_0_15px_rgba(128,0,0,0.4)]"
                      >
                         {isPlaying ? (
                           <div className="flex gap-1 h-3 w-3 items-center">
                             <div className="w-1 h-full bg-white animate-pulse" />
                             <div className="w-1 h-full bg-white animate-pulse delay-75" />
                           </div>
                         ) : (
                           <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                         )}
                      </button>
                      <div className="flex-1 flex items-center gap-1 h-8">
                         {[...Array(40)].map((_, i) => (
                           <div 
                             key={i} 
                             className={`w-[2px] rounded-full transition-all duration-300 ${isPlaying ? 'bg-maroon-500 animate-[bounce_1s_infinite]' : 'bg-zinc-700'}`}
                             style={{ 
                               height: isPlaying ? `${Math.random() * 100}%` : `${20 + Math.random() * 30}%`,
                               animationDelay: `${i * 0.05}s`
                             }}
                            />
                         ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{isPlaying ? '0:14' : '0:00'} / {formatDuration(selectedCall.duration)}</span>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {/* Summary & Extracted Data */}
                {selectedCall.summary && (
                  <div className="p-6 border-b border-white/5">
                    <h4 className="text-[10px] font-bold text-maroon-400 uppercase tracking-widest mb-3 opacity-80">AI Executive Summary</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">{selectedCall.summary}</p>
                  </div>
                )}

                {selectedCall.extractedData && Object.keys(selectedCall.extractedData).length > 0 && (
                  <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                    <h4 className="text-[10px] font-bold text-maroon-400 uppercase tracking-widest mb-4 opacity-80">Extracted Call Intelligence</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedCall.extractedData).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-xl bg-black/30 border border-white/5">
                          <p className="text-[10px] text-zinc-500 capitalize mb-1 font-semibold">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-white font-bold">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                <div className="p-6 space-y-4">
                  <h4 className="text-[10px] font-bold text-maroon-400 uppercase tracking-widest mb-2 opacity-80">Full Conversation Transcript</h4>
                  {selectedCall.transcript.length > 0 ? selectedCall.transcript.map((entry, i) => (
                    <div key={i} className={`flex ${entry.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <span className={`text-[9px] uppercase tracking-tighter font-bold ${entry.role === 'ai' ? 'text-maroon-500/70' : 'text-zinc-600'}`}>
                          {entry.role === 'ai' ? 'AgentFlow AI' : 'Caller'}
                        </span>
                        <div className={`p-4 rounded-2xl text-[13px] leading-snug ${
                          entry.role === 'ai'
                            ? 'bg-maroon-900/20 text-zinc-200 border border-maroon-500/20 rounded-tl-none'
                            : 'bg-white/5 text-white border border-white/10 rounded-tr-none'
                        }`}>
                          {entry.text}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center py-10 opacity-30">
                       <Clock className="h-8 w-8 mb-2" />
                       <p className="text-xs italic">Live transcript generation in progress...</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 bg-white/[0.01]">
              <Phone className="h-16 w-16 mb-6 opacity-10 animate-pulse" />
              <p className="text-sm font-medium tracking-wide">Select an interaction to begin analysis</p>
              <p className="text-[10px] mt-2 text-zinc-500">Intelligent post-call summaries will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
