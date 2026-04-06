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
    <Card className="glass-card border-border shadow-sm group hover:border-primary/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/5 rounded-lg border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
          <Icon className="h-4 w-4 text-primary group-hover:text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tighter text-foreground italic">{value}</div>
        <p className="text-[10px] font-bold text-muted-foreground mt-2 flex items-center gap-2 uppercase tracking-widest">
          {trend && (
            <span className={cn(
              "font-black py-0.5 px-1.5 rounded-md",
              trend === "up" && "text-emerald-500 bg-emerald-500/10",
              trend === "down" && "text-rose-500 bg-rose-500/10",
              trend === "neutral" && "text-muted-foreground bg-muted"
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
