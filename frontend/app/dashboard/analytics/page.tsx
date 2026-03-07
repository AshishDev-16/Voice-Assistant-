import { BarChart, Activity, PieChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">Deep dive into your AI assistant performance metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Placeholder Charts */}
        <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 flex flex-col h-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Conversation Trends</h3>
            <BarChart className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-zinc-400 bg-black/20 backdrop-blur-md shadow-inner">
            [Bar Chart Placeholder]
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 flex flex-col h-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">User Intent Split</h3>
            <PieChart className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-zinc-400 bg-black/20 backdrop-blur-md shadow-inner">
            [Pie Chart Placeholder]
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Real-time Activity</h3>
            <Activity className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="h-40 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-zinc-400 bg-black/20 backdrop-blur-md shadow-inner">
            [Activity Heatmap Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
