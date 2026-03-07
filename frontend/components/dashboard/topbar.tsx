import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-2xl px-6 shrink-0 z-20 shadow-sm">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search conversations, products..."
            className="h-9 w-full rounded-md border border-white/10 bg-black/20 backdrop-blur-md pl-9 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:bg-black/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors shadow-inner"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-transparent shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
        </button>
      </div>
    </header>
  );
}
