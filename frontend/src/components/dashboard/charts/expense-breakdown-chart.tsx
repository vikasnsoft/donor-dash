"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ExpenseBreakdownChartProps {
  data: Record<string, number>;
  height?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  decoration: "Decoration",
  venue: "Venue",
  sound_lighting: "Sound & Lighting",
  prasad: "Prasad",
  committee: "Committee",
  volunteer: "Volunteer",
  misc: "Miscellaneous",
  general: "General",
};

const COLORS = [
  "#f97316",
  "#eab308",
  "#059669",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function ExpenseBreakdownChart({
  data,
  height = 250,
}: ExpenseBreakdownChartProps) {
  const formatted = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      value,
    }));

  if (formatted.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No expense data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {formatted.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
