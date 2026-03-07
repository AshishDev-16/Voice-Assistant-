import { StatsCard } from "@/components/dashboard/stats-card";
import { MessageSquare, Users, ShoppingCart, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">Here is what's happening with your WhatsApp assistant today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Conversations"
          value="1,248"
          description="from last month"
          icon={MessageSquare}
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Active Leads"
          value="432"
          description="from last month"
          icon={Users}
          trend="up"
          trendValue="8%"
        />
        <StatsCard
          title="Orders Closed (AI)"
          value="89"
          description="from last month"
          icon={ShoppingCart}
          trend="up"
          trendValue="24%"
        />
        <StatsCard
          title="AI Reply Rate"
          value="94%"
          description="queries handled without human"
          icon={Zap}
          trend="neutral"
          trendValue="0%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-semibold text-lg mb-4">Conversation Volume</h3>
          <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 bg-zinc-950/50">
            [Chart Area Placeholder]
          </div>
        </div>
        <div className="col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-semibold text-lg mb-4">Recent AI Actions</h3>
          <div className="space-y-4">
            {[
              { time: "2m ago", action: "Answered pricing query", number: "+1 234 *** 890" },
              { time: "15m ago", action: "Captured lead email", number: "+44 789 *** 123" },
              { time: "1h ago", action: "Processed order #1042", number: "+1 555 *** 321" },
              { time: "2h ago", action: "Handed over to human", number: "+61 412 *** 456" },
            ].map((feed, i) => (
              <div key={i} className="flex flex-col gap-1 border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                <span className="text-sm font-medium text-zinc-200">{feed.action}</span>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{feed.number}</span>
                  <span>{feed.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
