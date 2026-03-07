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
        <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col h-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-200">Conversation Trends</h3>
            <BarChart className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="flex-1 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 bg-zinc-950/50">
            [Bar Chart Placeholder]
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col h-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-200">User Intent Split</h3>
            <PieChart className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="flex-1 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 bg-zinc-950/50">
            [Pie Chart Placeholder]
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-200">Real-time Activity</h3>
            <Activity className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="h-40 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 bg-zinc-950/50">
            [Activity Heatmap Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
