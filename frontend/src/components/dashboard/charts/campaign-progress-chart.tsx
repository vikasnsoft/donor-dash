"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CampaignProgressChartProps {
  data: Array<{
    name: string;
    target: number;
    collected: number;
    completionPercentage: number;
  }>;
  height?: number;
}

const COLORS = ["#f97316", "#eab308", "#059669", "#3b82f6", "#8b5cf6"];

export function CampaignProgressChart({ data, height = 250 }: CampaignProgressChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    name: d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={formatted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12 }}
          width={120}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Completion"]}
        />
        <Bar dataKey="completionPercentage" radius={[0, 4, 4, 0]}>
          {formatted.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
