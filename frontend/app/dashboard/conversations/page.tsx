"use client";

import { Search, Filter, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ConversationsPage() {
  const { getToken } = useAuth();

  const authFetcher = async (url: string) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api${url}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  };

  const { data: conversations, error } = useSWR("/dashboard/conversations", authFetcher);
  const isLoading = !conversations && !error;

  return (
    <div className="max-w-6xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 p-4 md:p-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary/30 decoration-8 underline-offset-[12px] mb-6">
            Neural Chats
          </h1>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] italic leading-relaxed max-w-2xl">
            Direct satellite uplink to terrestrial terminal communications and node-to-node dialogues.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-border glass-card text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-primary/10 hover:text-primary transition-all">
            <Filter className="mr-3 h-4 w-4" /> Protocol Filter
          </Button>
          <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[.3em] italic shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
            Initialize Stream
          </Button>
        </div>
      </div>

      <div className="rounded-[48px] border-2 border-border glass-card overflow-hidden shadow-2xl transition-all">
        <div className="p-8 border-b-2 border-border flex flex-col md:flex-row items-center gap-6 bg-card/10">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="SEARCH NODE OR IDENTIFIER..."
              className="h-16 w-full rounded-[24px] border-2 border-border bg-background pl-16 pr-8 text-xs font-black text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary italic tracking-widest shadow-inner transition-all"
            />
          </div>
          <div className="hidden md:block h-8 w-[2px] bg-border/50 italic mx-4" />
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] italic">
             <span className="text-primary italic animate-pulse">●</span> LIVE SYNC ACTIVE
          </div>
        </div>
        
        <div className="divide-y-2 divide-border bg-card/5">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-6">
               <Loader2 className="h-10 w-10 text-primary animate-spin" />
               <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] animate-pulse italic">Connecting to Uplink...</p>
            </div>
          ) : conversations?.length > 0 ? (
            conversations.map((chat: any) => (
              <div key={chat._id} className="p-8 hover:bg-primary/5 transition-all flex items-center justify-between group cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 glass-card border-2 border-border rounded-[24px] flex items-center justify-center text-foreground font-black text-xl italic shadow-inner group-hover:scale-110 group-hover:border-primary/40 transition-all">
                    {chat._id.charAt(0) === '+' ? chat._id.charAt(1) : chat._id.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base font-black text-foreground uppercase italic tracking-tight">{chat._id}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground/60 italic truncate max-w-sm md:max-w-xl transition-colors group-hover:text-foreground/70">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">{new Date(chat.lastTimestamp).toLocaleDateString()}</span>
                    <span className={`text-[9px] uppercase font-black px-4 py-1.5 rounded-full border-2 italic tracking-tighter ${
                      chat.direction === 'outbound' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {chat.direction === 'outbound' ? 'SA-LINK RESPONSE' : 'NODE TRANSMISSION'}
                    </span>
                  </div>
                  <button className="h-12 w-12 rounded-xl bg-card border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-32 text-center flex flex-col items-center justify-center gap-8">
               <div className="relative">
                  <Search className="h-20 w-20 opacity-[0.05] text-foreground" />
                  <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
               </div>
               <div>
                  <p className="text-lg font-black text-foreground uppercase italic tracking-[0.3em] mb-2">Terminal Clear</p>
                  <p className="text-[11px] font-black text-muted-foreground uppercase opacity-40 italic tracking-widest leading-relaxed">No dialogue streams identified via current sync protocol.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
