"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DonationTrendChartProps {
  data: Array<{
    date: string;
    totalAmount: number;
    donationCount: number;
    cumulativeTotal: number;
  }>;
  height?: number;
}

export function DonationTrendChart({ data, height = 250 }: DonationTrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="totalAmount"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Daily"
        />
        <Line
          type="monotone"
          dataKey="cumulativeTotal"
          stroke="#059669"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Cumulative"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
