import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getProductById } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

/**
 * Horizontal scroll strip of the last products the user opened.
 * Renders nothing if there's no history yet, so it never shows an empty rail.
 */
export default function RecentlyViewed({ className = "" }: { className?: string }) {
  const ids = useRecentlyViewed();
  const { formatPrice } = useCurrency();
  const items = ids.map(getProductById).filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  if (items.length < 2) return null;

  return (
    <section className={`border-y border-border/40 bg-secondary/20 py-6 ${className}`}>
      <div className="container">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Clock className="h-3 w-3" /> Recently viewed
          </h3>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group w-32 shrink-0 snap-start"
            >
              <div className="overflow-hidden rounded-xl bg-secondary/60 aspect-[3/4]">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brandName}</p>
              <p className="truncate text-xs font-medium text-foreground/90">{p.name}</p>
              <p className="text-xs font-bold">{formatPrice(p.price, p.prices)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}