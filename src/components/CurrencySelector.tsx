import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import type { CurrencyCode } from "@/contexts/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency.code} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger className="h-8 w-[60px] rounded-full border-muted-foreground/20 text-xs font-medium [&>span:first-child]:hidden">
        <span>{currency.code}</span>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code} className="text-xs">
            {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
