import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "NGN";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
}

const DEFAULT_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.55 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 150.5 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1550 },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  currencies: CurrencyInfo[];
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdPrice: number) => string;
  isLive: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>(DEFAULT_CURRENCIES);
  const [selectedCode, setSelectedCode] = useState<CurrencyCode>("USD");
  const [isLive, setIsLive] = useState(false);

  // Fetch live rates on mount
  useEffect(() => {
    async function fetchRates() {
      try {
        const { data, error } = await supabase.functions.invoke("exchange-rates");
        if (error) throw error;
        if (data?.success && data.rates) {
          setCurrencies(prev =>
            prev.map(c => ({
              ...c,
              rate: data.rates[c.code] ?? c.rate,
            }))
          );
          setIsLive(!data.fallback);
        }
      } catch (e) {
        console.warn("Failed to fetch live rates, using defaults:", e);
      }
    }
    fetchRates();
  }, []);

  const currency = currencies.find(c => c.code === selectedCode) || currencies[0];

  const setCurrency = useCallback((code: CurrencyCode) => {
    setSelectedCode(code);
  }, []);

  const formatPrice = useCallback((usdPrice: number) => {
    const converted = usdPrice * currency.rate;
    if (currency.code === "JPY" || currency.code === "NGN") {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, currencies, setCurrency, formatPrice, isLive }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const CURRENCIES = DEFAULT_CURRENCIES;

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
