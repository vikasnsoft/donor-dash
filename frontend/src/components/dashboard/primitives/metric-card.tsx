"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label?: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <>
              {trend.value > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : trend.value < 0 ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground" />
              )}
              <span
                className={`text-xs ${
                  trend.value > 0
                    ? "text-green-500"
                    : trend.value < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
                {trend.label && ` ${trend.label}`}
              </span>
            </>
          )}
          {subtitle && !trend && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
