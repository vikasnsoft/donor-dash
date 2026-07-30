"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/lib/constants/currencies";

interface CurrencyPickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyPicker({
  value = "INR",
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
}: CurrencyPickerProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} — {currency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
