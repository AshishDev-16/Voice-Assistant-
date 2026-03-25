"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CalendarCheck2, Clock, User, Phone, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Appointment {
  id: string;
  callerNumber: string;
  outcome: string;
  summary: string;
  sentiment?: string;
  extractedData: Record<string, any>;
  date: string;
  duration: number;
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  switch (sentiment) {
    case 'positive': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-medium">Positive</span>;
    case 'negative': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 font-medium">Negative</span>;
    case 'lead': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-maroon-500/20 text-maroon-400 border border-maroon-500/20 font-medium uppercase font-bold tracking-tighter">LEAD</span>;
    default: return <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-500/20 font-medium">Neutral</span>;
  }
}

export default function AppointmentsPage() {
  const { userId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/dashboard/appointments?businessId=${userId}`)
      .then(r => r.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // Friendly labels for extracted data keys
  const friendlyLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <CalendarCheck2 className="h-7 w-7 text-maroon-400" />
          Appointments & Orders
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Every booking, order, and inquiry your AI agent has handled — with all collected details.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-maroon-400 animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <CalendarCheck2 className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">No appointments yet</p>
          <p className="text-sm mt-2 max-w-md text-center">
            When your AI agent books appointments, takes orders, or collects information from callers, they&apos;ll appear here automatically.
          </p>
        </div>
      ) : (
        <div className="flex gap-6 h-[calc(100vh-14rem)]">
          {/* Appointments List */}
          <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">All Records</h2>
              <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full">{appointments.length} total</span>
            </div>
            <div className="flex-1 overflow-auto">
              {appointments.map((apt, i) => (
                <motion.button
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(apt)}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 ${selected?.id === apt.id ? 'bg-maroon-900/20 border-l-2 border-l-maroon-500' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-maroon-900/30 border border-maroon-500/30 flex items-center justify-center shrink-0">
                    <CalendarCheck2 className="h-5 w-5 text-maroon-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {apt.extractedData?.['Patient Name'] || apt.extractedData?.['Guest Name'] || apt.extractedData?.['Customer Name'] || apt.extractedData?.['Client Name'] || apt.callerNumber}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{apt.outcome}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-500">{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-xs text-zinc-600">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="w-1/2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 overflow-hidden flex flex-col">
            {selected ? (
              <>
                <div className="p-5 border-b border-white/5">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Phone className="h-4 w-4 text-maroon-400" />
                    {selected.callerNumber}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(selected.date).toLocaleString()}</span>
                    <span className="px-2 py-0.5 rounded-full bg-maroon-900/30 text-maroon-400 border border-maroon-500/20">{selected.outcome}</span>
                  </div>
                </div>

                {/* AI Summary */}
                {selected.summary && (
                  <div className="p-5 border-b border-white/5">
                    <h4 className="text-xs font-semibold text-maroon-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" /> AI Summary
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{selected.summary}</p>
                  </div>
                )}

                {/* Extracted Data — the main event */}
                <div className="flex-1 overflow-auto p-5">
                  <h4 className="text-xs font-semibold text-maroon-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Collected Information
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(selected.extractedData).map(([key, value]) => (
                      <div key={key} className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">{friendlyLabel(key)}</p>
                        <p className="text-base text-white font-medium">
                          {Array.isArray(value) ? value.join(', ') : String(value || '—')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <CalendarCheck2 className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">Select a record to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
