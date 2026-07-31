/**
 * Shared formatting utilities for dashboards, charts, and tables.
 * All components should use these instead of inline formatting.
 */

import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

// ─── Currency ────────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number | string | undefined | null,
  currency = "INR"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount || 0;

  if (currency === "INR") {
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatCurrencyCompact(amount: number | string | null): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount || 0;

  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}k`;
  }
  return `₹${num}`;
}

export function formatDecimal128(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  const obj = value as Record<string, unknown>;
  if (obj.$numberDecimal) return parseFloat(obj.$numberDecimal as string);
  return parseFloat(String(value));
}

// ─── Percentages ─────────────────────────────────────────────────────────────

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatPercentageChange(
  current: number,
  previous: number
): { value: number; label: string; direction: "up" | "down" | "flat" } {
  if (previous === 0) {
    return { value: 0, label: "0%", direction: "flat" };
  }

  const change = ((current - previous) / previous) * 100;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";

  return {
    value: Math.round(change * 10) / 10,
    label: `${change > 0 ? "+" : ""}${(Math.round(change * 10) / 10).toFixed(1)}%`,
    direction,
  };
}

// ─── Dates ───────────────────────────────────────────────────────────────────

export function formatDate(
  date: string | Date | null | undefined,
  formatStr = "dd MMM yyyy"
): string {
  if (!date) return "—";
  return format(new Date(date), formatStr);
}

export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—";
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return "—";
  const d = new Date(date);

  if (isToday(d)) {
    return `Today at ${format(d, "HH:mm")}`;
  }
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, "HH:mm")}`;
  }
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  if (month >= 3) {
    // April onwards: FY 2025-2026
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

// ─── Trends ──────────────────────────────────────────────────────────────────

export interface TrendData {
  value: number;
  label: string;
  direction: "up" | "down" | "flat";
  color: string;
}

export function formatTrend(
  current: number,
  previous: number,
  period = "vs last period"
): TrendData {
  const { value, label, direction } = formatPercentageChange(current, previous);
  const color =
    direction === "up"
      ? "text-green-500"
      : direction === "down"
      ? "text-red-500"
      : "text-muted-foreground";

  return { value, label: `${label} ${period}`, direction, color };
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  return value.toLocaleString("en-IN");
}

export function formatCompactNumber(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

// ─── Method Labels ───────────────────────────────────────────────────────────

export const PAYMENT_METHODS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  online: "Online",
  qr: "QR Code",
};

export function formatPaymentMethod(method: string): string {
  return PAYMENT_METHODS[method] || method;
}

// ─── Status Labels ───────────────────────────────────────────────────────────

export const EVENT_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-500" },
  planning: { label: "Planning", color: "bg-blue-500" },
  active: { label: "Active", color: "bg-green-500" },
  completed: { label: "Completed", color: "bg-purple-500" },
  closed: { label: "Closed", color: "bg-yellow-600" },
  archived: { label: "Archived", color: "bg-gray-400" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

export function formatEventStatus(status: string): {
  label: string;
  color: string;
} {
  return EVENT_STATUSES[status] || { label: status, color: "bg-gray-400" };
}
