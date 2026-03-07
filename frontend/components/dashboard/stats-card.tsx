import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, trendValue }: StatsCardProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
          {trend && (
            <span className={cn(
              "font-medium",
              trend === "up" && "text-emerald-400",
              trend === "down" && "text-red-400",
              trend === "neutral" && "text-zinc-400"
            )}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trendValue}
            </span>
          )}{" "}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
