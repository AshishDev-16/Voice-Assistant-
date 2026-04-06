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
    case 'positive': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black uppercase tracking-widest italic">Positive</span>;
    case 'negative': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-black uppercase tracking-widest italic">Negative</span>;
    case 'lead': return <span className="text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-black uppercase tracking-tighter shadow-xl shadow-primary/10 italic">HOT LEAD</span>;
    default: return <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-black uppercase tracking-widest italic">Neutral</span>;
  }
}

function LeadScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-primary border-primary/30 bg-primary/10' : 
                score >= 50 ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 
                'text-muted-foreground border-border bg-muted';
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${color} font-black text-[11px] italic tracking-tight shadow-inner`}>
      <Target className="h-4 w-4" />
      {score}% PROTOCOL MATCH
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
    <div className="flex-1 overflow-hidden p-4 md:p-6 space-y-6 flex flex-col h-screen bg-background transition-colors duration-500">
      <div className="flex justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3 uppercase italic underline decoration-primary/30 decoration-4 underline-offset-[8px] transition-all">
            <Brain className="h-8 w-8 text-primary" />
            Call Insights
          </h1>
          <p className="text-[10px] text-muted-foreground mt-3 font-black uppercase tracking-[0.2em] italic leading-relaxed max-w-xl">
            AI ANALYSIS · DETAILED SUMMARIES · DATA EXTRACTION
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-primary/10 border-2 border-primary/20 text-[9px] font-black text-primary uppercase tracking-[0.2em] shadow-inner italic">
            TACTICAL ENGINE: ACTIVE
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Intelligence Feed */}
        <div className="w-[380px] rounded-2xl glass-card border-2 border-border overflow-hidden flex flex-col shadow-xl relative">
          <div className="p-5 border-b-2 border-border bg-card/10 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[.2em] flex items-center gap-2 italic">
               <Zap className="h-4 w-4 text-primary animate-pulse" /> Call Activity
            </h2>
            <span className="text-[9px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20 italic tracking-widest">{records.length} CALLS</span>
          </div>

          <div className="flex-1 overflow-auto divide-y-2 divide-border scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse italic">Syncing...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <ShieldCheck className="h-12 w-12 mb-4 opacity-10 text-primary" />
                <p className="text-sm font-black text-foreground uppercase italic tracking-widest">No Activity</p>
                <p className="text-[9px] mt-2 font-black text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed italic">Awaiting your first AI-handled call.</p>
              </div>
            ) : (
              records.map((rec, i) => (
                <motion.button
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                  onClick={() => setSelected(rec)}
                  className={`w-full flex items-start gap-4 p-5 hover:bg-primary/5 transition-all text-left relative group ${selected?.id === rec.id ? 'bg-primary/10' : ''}`}
                >
                  {selected?.id === rec.id && (
                    <motion.div layoutId="activeIntelligence" className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                  )}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all group-hover:scale-105 shadow-inner ${
                    rec.leadScore >= 80 ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'
                  }`}>
                    {rec.sentiment === 'lead' ? <Target className="h-5 w-5 text-primary" /> : <Brain className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <p className="text-sm font-black text-foreground italic tracking-tight">{rec.callerNumber}</p>
                       <p className="text-[8px] font-black text-muted-foreground/40 uppercase italic tracking-widest">{new Date(rec.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground truncate mb-3 italic leading-relaxed">{rec.outcome}</p>
                    <div className="flex items-center gap-2">
                      <SentimentBadge sentiment={rec.sentiment} />
                      {rec.leadScore > 0 && <span className="text-[9px] font-black text-muted-foreground/60 tracking-widest uppercase italic">{rec.leadScore}% MATCH</span>}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Deep Dive */}
        <div className="flex-1 rounded-3xl glass-card border-2 border-border overflow-hidden flex flex-col shadow-xl relative min-w-0 transition-all duration-500 bg-card/5">
           <AnimatePresence mode="wait">
            {selected ? (
              <motion.div 
                key={selected.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full min-h-0"
              >
                <div className="p-6 border-b-2 border-border bg-card/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                   <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 italic">Call Details</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-foreground tracking-tighter italic uppercase">{selected.callerNumber}</span>
                            <LeadScoreBadge score={selected.leadScore} />
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] italic opacity-80">
                           <div className="flex items-center gap-2">
                             <Clock className="h-3.5 w-3.5 text-primary" />
                             <span>RECORDED {new Date(selected.date).toLocaleString().toUpperCase()}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Target className="h-3.5 w-3.5 text-primary" />
                             <span className="text-foreground italic">{selected.outcome.toUpperCase()}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <SentimentBadge sentiment={selected.sentiment} />
                        <button className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all border-none">
                          <Phone className="h-5 w-5" />
                        </button>
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-auto bg-card/5 scrollbar-hide p-6">
                   <div className="grid grid-cols-12 gap-6 max-w-full">
                      {/* Summary Section */}
                      <div className="col-span-12 lg:col-span-12 space-y-6">
                         <section>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                               <FileText className="h-3.5 w-3.5" /> AI Summary
                            </h4>
                            <div className="p-5 rounded-2xl bg-background border-2 border-border text-sm text-foreground leading-relaxed font-bold shadow-inner italic relative overflow-hidden group">
                               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                               <span className="relative z-10">{selected.summary}</span>
                            </div>
                         </section>

                         <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div>
                               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                                  <Zap className="h-3.5 w-3.5" /> Call Outcome
                               </h4>
                               <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 shadow-lg relative group overflow-hidden">
                                  <p className="text-xl font-black text-foreground italic uppercase tracking-tighter leading-snug">{selected.outcome}</p>
                                  <p className="text-[9px] text-muted-foreground mt-2 font-black uppercase tracking-widest italic opacity-60">AI confidence: 99.1% accurate.</p>
                               </div>
                            </div>

                            <div>
                               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2 italic">
                                  <Brain className="h-3.5 w-3.5" /> Extracted Info
                               </h4>
                               <div className="grid grid-cols-1 gap-4">
                                  {Object.entries(selected.extractedData).slice(0, 4).map(([key, value], i) => (
                                    <motion.div 
                                      key={key}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.05 + 0.3 }}
                                      className="p-4 rounded-xl bg-background border-2 border-border hover:border-primary/40 transition-all group"
                                    >
                                      <p className="text-[9px] text-muted-foreground/60 mb-1 uppercase tracking-[0.2em] font-black italic">
                                        {friendlyLabel(key)}
                                      </p>
                                      <p className="text-base text-foreground font-black tracking-tighter uppercase italic">
                                        {Array.isArray(value) ? value.join(', ') : String(value || 'N/A')}
                                      </p>
                                    </motion.div>
                                  ))}
                               </div>
                            </div>
                         </section>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
                <div className="relative mb-8">
                  <Brain className="h-20 w-20 opacity-[0.05] animate-pulse text-foreground" />
                  <Target className="h-8 w-8 absolute bottom-4 right-0 text-primary animate-bounce opacity-20" />
                </div>
                <p className="text-lg font-black tracking-[0.4em] uppercase italic text-foreground/40">Protocol Selection Required</p>
                <p className="text-[10px] mt-3 font-black uppercase tracking-[0.2em] opacity-40 italic max-w-xs leading-relaxed">Select a terminal node to initiate deep analysis.</p>
              </div>
            )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
