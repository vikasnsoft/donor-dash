"use client";

import { Input } from "@/components/ui/input";
import { getCurrencySymbol } from "@/lib/constants/currencies";

interface AmountInputProps {
  value?: string | number;
  onChange?: (value: string) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  currency = "INR",
  placeholder = "0.00",
  disabled = false,
  className,
}: AmountInputProps) {
  const symbol = getCurrencySymbol(currency);

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {symbol}
      </span>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-8"
        min="0"
        step="0.01"
      />
    </div>
  );
}
