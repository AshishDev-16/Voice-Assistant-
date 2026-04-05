"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Brain, Clock, User, Phone, FileText, Loader2, Target, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface IntelligenceRecord {
  id: string;
  callerNumber: string;
  outcome: string;
  summary: string;
  sentiment?: string;
  leadScore: number;
  extractedData: Record<string, any>;
  date: string;
  duration: number;
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  switch (sentiment) {
    case 'positive': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium">Positive</span>;
    case 'negative': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 font-medium">Negative</span>;
    case 'lead': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-500/20 text-maroon-400 border border-maroon-500/20 font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(128,0,0,0.3)]">HOT LEAD</span>;
    default: return <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-500/20 font-medium">Neutral</span>;
  }
}

function LeadScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-maroon-400 border-maroon-500/30 bg-maroon-500/10' : 
                score >= 50 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 
                'text-zinc-500 border-white/5 bg-white/5';
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${color} font-mono text-[11px] font-bold`}>
      <Target className="h-3 w-3" />
      {score}% Match
    </div>
  );
}

export default function IntelligenceHubPage() {
  const { userId, getToken } = useAuth();
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IntelligenceRecord | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    async function fetchData() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/dashboard/intelligence?businessId=${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
        if (data && data.length > 0 && !selected) setSelected(data[0]);
      } catch (err) {
        console.error("Failed to fetch intelligence data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const friendlyLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  };

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col h-screen bg-black/20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-maroon-500" />
            Intelligence Hub
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium italic">
            Dynamic business insights, lead scoring, and automated extraction.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="p-1 px-3 rounded-full bg-maroon-500/10 border border-maroon-500/20 text-[10px] font-bold text-maroon-400 uppercase tracking-widest">
            Pro Engine Active
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Intelligence Feed */}
        <div className="w-[400px] rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-yellow-500" /> Live Feed
            </h2>
            <span className="text-[10px] font-mono text-zinc-600 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">{records.length} interactions</span>
          </div>

          <div className="flex-1 overflow-auto divide-y divide-white/5 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                <Loader2 className="h-8 w-8 text-maroon-500 animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Synchronizing Hub...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600 px-10 text-center">
                <ShieldCheck className="h-16 w-16 mb-4 opacity-10" />
                <p className="text-sm font-bold text-zinc-400">Hub is Vacant</p>
                <p className="text-[10px] mt-2 font-medium opacity-60">Intelligence will materialize here once your AI begins customer engagement.</p>
              </div>
            ) : (
              records.map((rec, i) => (
                <motion.button
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(rec)}
                  className={`w-full flex items-start gap-4 p-5 hover:bg-white/[0.03] transition-all text-left relative group ${selected?.id === rec.id ? 'bg-white/[0.04]' : ''}`}
                >
                  {selected?.id === rec.id && (
                    <motion.div layoutId="activeIntelligence" className="absolute left-0 top-0 bottom-0 w-1 bg-maroon-500" />
                  )}
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                    rec.leadScore >= 80 ? 'bg-maroon-500/10 border-maroon-500/30' : 'bg-black/40 border-white/5'
                  }`}>
                    {rec.sentiment === 'lead' ? <Target className="h-5 w-5 text-maroon-400" /> : <Brain className="h-5 w-5 text-zinc-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-xs font-black text-white">{rec.callerNumber}</p>
                       <p className="text-[9px] font-mono text-zinc-600 uppercase">{new Date(rec.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-[11px] font-bold text-zinc-400 truncate mb-2">{rec.outcome}</p>
                    <div className="flex items-center gap-2">
                      <SentimentBadge sentiment={rec.sentiment} />
                      {rec.leadScore > 0 && <span className="text-[9px] font-mono text-zinc-600 tracking-tighter font-bold">{rec.leadScore}%</span>}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Deep Dive */}
        <div className="flex-1 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl relative min-w-0">
           <AnimatePresence mode="wait">
            {selected ? (
              <motion.div 
                key={selected.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col h-full min-h-0"
              >
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                   <div className="flex items-start justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1">Intelligence Protocol</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-white tracking-tighter">{selected.callerNumber}</span>
                            <LeadScoreBadge score={selected.leadScore} />
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                             <Clock className="h-3 w-3 text-maroon-500" />
                             <span>Captured {new Date(selected.date).toLocaleString()}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Target className="h-3 w-3 text-maroon-500" />
                             <span>{selected.outcome}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <SentimentBadge sentiment={selected.sentiment} />
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 text-maroon-400 shadow-lg">
                          <Phone className="h-5 w-5" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-auto bg-black/10 scrollbar-hide">
                   <div className="grid grid-cols-12 gap-8 p-8 max-w-full">
                      {/* Summary Section */}
                      <div className="col-span-12 lg:col-span-4 space-y-8">
                         <section>
                            <h4 className="text-[10px] font-black text-maroon-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <FileText className="h-3 w-3" /> AI Summary
                            </h4>
                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-sm text-zinc-300 leading-relaxed font-medium shadow-inner">
                               {selected.summary}
                            </div>
                         </section>

                         <section>
                            <h4 className="text-[10px] font-black text-maroon-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Zap className="h-3 w-3" /> Predictive Outcome
                            </h4>
                            <div className="p-5 rounded-2xl bg-maroon-500/5 border border-maroon-500/10">
                               <p className="text-sm font-black text-white">{selected.outcome}</p>
                               <p className="text-[10px] text-zinc-500 mt-1 font-medium">Confidence based on dialogue depth and sentiment markers.</p>
                            </div>
                         </section>
                      </div>

                      {/* Dynamic Intelligence Data */}
                      <div className="col-span-12 lg:col-span-8">
                         <h4 className="text-[10px] font-black text-maroon-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Brain className="h-3 w-3" /> Extracted Intelligence
                         </h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selected.extractedData).map(([key, value]) => (
                              <motion.div 
                                key={key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-maroon-500/20 transition-all group"
                              >
                                <p className="text-[9px] text-zinc-600 mb-1 uppercase tracking-widest font-black group-hover:text-maroon-500/50 transition-colors">
                                  {friendlyLabel(key)}
                                </p>
                                <p className="text-base text-white font-black tracking-tight underline decoration-maroon-500/30 decoration-2 underline-offset-4">
                                  {Array.isArray(value) ? value.join(', ') : String(value || '—')}
                                </p>
                              </motion.div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 bg-white/[0.01]">
                <div className="relative">
                  <Brain className="h-24 w-24 mb-6 opacity-[0.03] animate-pulse" />
                  <Target className="h-8 w-8 absolute bottom-4 right-0 text-maroon-500/10 animate-bounce" />
                </div>
                <p className="text-sm font-bold tracking-widest uppercase">Protocol Selection Required</p>
                <p className="text-[10px] mt-2 font-medium opacity-60">Consult the local feed to initiate deep intelligence analysis.</p>
              </div>
            )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
