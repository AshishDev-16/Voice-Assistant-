"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Phone, PhoneIncoming, PhoneMissed, Clock, ChevronRight, Loader2, FileText, Brain, Target, Zap, Activity, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      case 'completed': return <Phone className="h-4 w-4 text-emerald-500" />;
      case 'missed': return <PhoneMissed className="h-4 w-4 text-rose-500" />;
      case 'in-progress': return <PhoneIncoming className="h-4 w-4 text-amber-500 animate-pulse" />;
      default: return <Phone className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const SentimentBadge = ({ sentiment }: { sentiment?: string }) => {
    switch (sentiment) {
      case 'positive': return <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-widest italic">Positive</span>;
      case 'negative': return <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-black uppercase tracking-widest italic">Negative</span>;
      case 'lead': return <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest italic shadow-xl shadow-primary/10">HOT LEAD</span>;
      default: return <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-black uppercase tracking-widest italic">Neutral</span>;
    }
  };

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6 flex flex-col h-screen bg-background transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary/30 decoration-4 underline-offset-[8px] mb-3">
            Call Operations
          </h1>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic leading-relaxed max-w-2xl">
            AI AGENT STREAM · LIVE TRANSCRIPTION · DATA FEED
          </p>
        </div>
        <div className="flex items-center gap-4">
           {/* Quick Stats Summary */}
           <div className="flex gap-3">
               <div className="px-4 py-2 rounded-xl glass-card border border-border flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest italic text-foreground">{stats.completedCalls} SUCCESS</span>
               </div>
               <div className="px-4 py-2 rounded-xl glass-card border border-border flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest italic text-foreground">{stats.missedCalls} MISSED</span>
               </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Call Inbox Feed */}
        <div className="w-[360px] rounded-2xl glass-card border-2 border-border overflow-hidden flex flex-col shadow-xl relative transition-all">
          <div className="p-5 border-b-2 border-border bg-card/10 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[.2em] flex items-center gap-2 italic">
              <Phone className="h-4 w-4 text-primary" /> Transmission Log
            </h2>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <Loader2 className={`h-3 w-3 text-primary ${loading ? 'animate-spin' : ''}`} />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto divide-y-2 divide-border scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse italic">Scanning Uplinks...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <PhoneMissed className="h-10 w-10 mb-3 opacity-5 text-primary" />
                <p className="text-xs font-black text-foreground uppercase italic tracking-widest">Feed Null</p>
                <p className="text-[9px] mt-2 font-black text-muted-foreground uppercase italic tracking-widest opacity-60 leading-relaxed max-w-[160px]">Awaiting terminal engagement node log.</p>
              </div>
            ) : (
              calls.map((call) => (
                <button
                  key={call._id}
                  onClick={() => setSelectedCall(call)}
                  className={`w-full flex items-center gap-4 p-5 hover:bg-primary/5 transition-all text-left border-none relative group ${selectedCall?._id === call._id ? 'bg-primary/10' : 'bg-card/5'}`}
                >
                  {selectedCall?._id === call._id && (
                    <motion.div layoutId="activeCall" className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-lg shadow-primary/30" />
                  )}
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all group-hover:scale-105 shadow-inner ${
                    selectedCall?._id === call._id ? 'bg-primary/20 border-primary/30' : 'border-border bg-background/50'
                  }`}>
                    {statusIcon(call.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-xs font-black text-foreground italic tracking-tight">{call.callerNumber}</p>
                       <SentimentBadge sentiment={call.sentiment} />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground truncate italic tracking-tight mb-1">{call.outcome || call.status.toUpperCase()}</p>
                    <div className="flex items-center gap-3 text-[8px] font-black text-muted-foreground/40 italic uppercase tracking-widest">
                       <span>{formatDuration(call.duration)}</span>
                       <span>·</span>
                       <span>{new Date(call.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Call Detail Deep Dive */}
        <div className="flex-1 rounded-2xl glass-card border-2 border-border overflow-hidden flex flex-col shadow-xl relative min-w-0 bg-card/5">
          <AnimatePresence mode="wait">
            {selectedCall ? (
              <motion.div 
                key={selectedCall._id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full min-h-0"
              >
                <div className="p-6 border-b-2 border-border bg-card/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5 shadow-inner">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-foreground tracking-tighter italic uppercase">{selectedCall.callerNumber}</h3>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-80">
                           <div className="flex items-center gap-2">
                             <Clock className="h-3.5 w-3.5 text-primary" />
                             <span>{new Date(selectedCall.createdAt).toLocaleString().toUpperCase()} · {formatDuration(selectedCall.duration)}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                      <SentimentBadge sentiment={selectedCall.sentiment} />
                      <span className={`text-[9px] px-3 py-1 rounded-full border border-current font-black uppercase tracking-widest italic opacity-60 ${
                        selectedCall.status === 'completed' ? 'text-emerald-500' :
                        selectedCall.status === 'missed' ? 'text-rose-500' :
                        'text-amber-500'
                      }`}>
                        STREAM: {selectedCall.status}
                      </span>
                    </div>
                  </div>

                  {/* Tactical Audio Playback UI */}
                  <div className="mt-6 p-5 rounded-2xl bg-background border border-border shadow-inner relative group overflow-hidden transition-all hover:border-primary/20">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <div className="flex items-center gap-6 relative z-10">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center hover:scale-105 active:scale-95"
                        >
                           {isPlaying ? (
                             <div className="flex gap-1 h-3 items-center">
                               <div className="w-1 h-full bg-white animate-pulse" />
                               <div className="w-1 h-full bg-white animate-pulse delay-75" />
                             </div>
                           ) : (
                             <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                           )}
                        </button>
                        <div className="flex-1 flex items-center gap-1 h-8">
                           {[...Array(40)].map((_, i) => (
                             <div 
                               key={i} 
                               className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-primary animate-[bounce_1s_infinite]' : 'bg-muted-foreground/20'}`}
                               style={{ 
                                 height: isPlaying ? `${40 + Math.random() * 60}%` : `${10 + Math.random() * 20}%`,
                                 animationDelay: `${i * 0.05}s`
                               }}
                              />
                           ))}
                        </div>
                        <span className="text-[10px] font-black text-primary italic tracking-widest uppercase">{isPlaying ? 'Transmitting' : 'Ready'}</span>
                     </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-card/5 p-6 scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Executive Summary */}
                    <div className="p-6 rounded-2xl bg-background border border-border shadow-sm group">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                        <FileText className="h-3.5 w-3.5" /> AI Summary
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed font-bold italic opacity-90">{selectedCall.summary || 'Summary pending AI synthesis...'}</p>
                    </div>

                    {/* Extracted Intelligence */}
                    <div className="p-6 rounded-2xl bg-background border border-border shadow-sm">
                      <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                        <Brain className="h-3.5 w-3.5" /> Parameters
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedCall.extractedData && Object.keys(selectedCall.extractedData).length > 0 ? Object.entries(selectedCall.extractedData).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="p-3 rounded-xl bg-card border border-border group">
                            <p className="text-[8px] text-muted-foreground/60 font-black uppercase tracking-widest mb-1 italic truncate">{key.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-foreground font-black italic uppercase truncate">{String(value)}</p>
                          </div>
                        )) : (
                          <p className="col-span-2 text-[8px] text-muted-foreground/40 font-black uppercase tracking-widest text-center py-4">Protocol Null</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Transcript Section */}
                  <div className="space-y-6">
                    <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                      <Activity className="h-3.5 w-3.5" /> Live Stream Transcript
                    </h4>
                    {selectedCall.transcript.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCall.transcript.map((entry, i) => (
                          <div key={i} className={`flex ${entry.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`flex flex-col gap-1.5 max-w-[85%] ${entry.role === 'ai' ? 'items-start' : 'items-end'}`}>
                              <span className={`text-[8px] font-black uppercase tracking-widest italic ${entry.role === 'ai' ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                {entry.role === 'ai' ? 'AI Agent' : 'Caller'}
                              </span>
                              <div className={`p-5 rounded-2xl text-[13px] font-bold leading-relaxed shadow-lg italic ${
                                entry.role === 'ai'
                                  ? 'bg-primary/10 text-foreground border border-primary/20 rounded-tl-none'
                                  : 'bg-background text-foreground border border-border rounded-tr-none'
                              }`}>
                                {entry.text}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 opacity-20 italic">
                         <Loader2 className="h-8 w-8 mb-3 animate-spin" />
                         <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Link Stream</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Phone className="h-20 w-20 mb-8 opacity-[0.05] animate-pulse text-foreground" />
                <p className="text-lg font-black tracking-[0.3em] uppercase italic text-foreground/40">Hub Idle</p>
                <p className="text-[10px] mt-3 font-black uppercase tracking-[0.2em] opacity-40 italic max-w-xs leading-relaxed">Select a mission node to consult the live telemetry stream.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
