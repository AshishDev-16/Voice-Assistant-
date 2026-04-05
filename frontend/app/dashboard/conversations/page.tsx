"use client";

import { Search, Filter, MoreVertical } from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Conversations</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage all your WhatsApp chats down here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 shadow-sm border border-white/20">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            New Message
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-black/10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or number..."
              className="h-9 w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md pl-9 pr-4 text-sm text-white placeholder:text-zinc-400 focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
            />
          </div>
        </div>
        
        <div className="divide-y divide-white/10">
          {isLoading ? (
            <div className="p-8 text-center text-zinc-500 italic">Finding your chats...</div>
          ) : conversations?.length > 0 ? (
            conversations.map((chat: any) => (
              <div key={chat._id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-300 font-semibold shadow-inner">
                    {chat._id.charAt(0) === '+' ? chat._id.charAt(1) : chat._id.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-100">{chat._id}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-0.5 truncate max-w-md">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-xs text-zinc-500">{new Date(chat.lastTimestamp).toLocaleDateString()}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      chat.direction === 'outbound' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {chat.direction === 'outbound' ? 'AI Answered' : 'User Message'}
                    </span>
                  </div>
                  <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500 italic">No conversations found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
