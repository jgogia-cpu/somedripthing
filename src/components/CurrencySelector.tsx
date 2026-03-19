import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import type { CurrencyCode } from "@/contexts/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency.code} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger className="h-8 w-[76px] rounded-full border-muted-foreground/20 text-xs font-medium">
        <SelectValue />
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
