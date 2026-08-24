import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
  valueClass?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  valueClass,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={cn("text-2xl font-bold", valueClass)}>{value}</div>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              {trend.isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span
                className={cn("font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}
              >
                {trend.value}%
              </span>
              {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
