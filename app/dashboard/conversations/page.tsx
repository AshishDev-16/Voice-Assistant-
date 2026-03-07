import { Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockConversations = [
  { id: 1, name: "John Doe", number: "+1 234 567 890", lastMessage: "How much is the pro plan?", time: "2m ago", status: "AI Handled" },
  { id: 2, name: "Alice Smith", number: "+44 789 123 456", lastMessage: "I need to talk to a human", time: "15m ago", status: "Needs Human" },
  { id: 3, name: "Unknown", number: "+61 412 345 678", lastMessage: "Order #1204 status?", time: "1h ago", status: "AI Handled" },
  { id: 4, name: "Michael Ray", number: "+1 555 987 654", lastMessage: "Thanks!", time: "2h ago", status: "Closed" },
];

export default function ConversationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Conversations</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage all your WhatsApp chats down here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            New Message
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or number..."
              className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {mockConversations.map((chat) => (
            <div key={chat.id} className="p-4 hover:bg-zinc-800/50 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-semibold">
                  {chat.name === 'Unknown' ? '?' : chat.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-100">{chat.name}</span>
                    <span className="text-xs text-zinc-500">{chat.number}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5 truncate max-w-md">{chat.lastMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-xs text-zinc-500">{chat.time}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    chat.status === 'AI Handled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    chat.status === 'Needs Human' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {chat.status}
                  </span>
                </div>
                <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
