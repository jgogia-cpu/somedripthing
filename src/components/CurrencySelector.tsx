import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import type { CurrencyCode } from "@/contexts/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const FLAGS: Record<CurrencyCode, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  JPY: "🇯🇵",
  NGN: "🇳🇬",
};

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency.code} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
      <SelectTrigger className="h-8 w-[68px] rounded-full border-muted-foreground/20 text-xs font-medium">
        <SelectValue className="sr-only" aria-hidden="true" />
        <span aria-hidden="true" className="flex items-center gap-1.5">
          <span className="text-base leading-none">{FLAGS[currency.code]}</span>
          <span>{currency.code}</span>
        </span>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code} className="text-xs">
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{FLAGS[c.code]}</span>
              <span>{c.code}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
