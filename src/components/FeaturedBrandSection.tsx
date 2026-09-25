import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands, products, type Brand } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { isHidden } from "@/lib/hiddenProducts";

function pickDailyFeaturedBrand(): Brand {
  const pool = brands.filter((brand) => brand.featured && !["Apollo Originals", "Christopher Noir", "VeroBottega"].includes(brand.name)).sort((a, b) => a.id.localeCompare(b.id));
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  return pool[day % pool.length];
}

export default function FeaturedBrandSection() {
  const brand = useMemo(pickDailyFeaturedBrand, []);
  const brandProducts = useMemo(() => products.filter((product) => product.brandId === brand.id && !isHidden(product.id)).slice(0, 3), [brand.id]);
  const { formatPrice } = useCurrency();
  const image = brand.lookbook?.[0] || brand.banner;

  if (!brandProducts.length) return null;

  return (
    <section className="relative min-h-[760px] overflow-hidden border-b border-border md:min-h-[900px]">
      <img src={image} alt={`${brand.name} campaign`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="container relative z-10 flex min-h-[760px] flex-col justify-between py-16 md:min-h-[900px] md:py-24">
        <div className="grid gap-6 border-t border-foreground/30 pt-4 md:grid-cols-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent md:col-span-3">02 · Brand study</p>
          <p className="max-w-md text-sm leading-relaxed text-foreground/70 md:col-span-4">{brand.bio}</p>
        </div>

        <div>
          <h2 className="max-w-5xl font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.84]">{brand.name}</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="flex gap-3 overflow-x-auto md:col-span-8">
              {brandProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group w-36 shrink-0 border-t border-foreground/30 pt-3 md:w-44">
                  <p className="truncate text-xs font-semibold">{product.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-foreground/60">{formatPrice(product.price, product.prices)}</p>
                </Link>
              ))}
            </div>
            <Button asChild size="lg" className="rounded-none uppercase tracking-[0.14em] md:col-span-3 md:col-start-10"><Link to={`/brand/${brand.slug}`}>View brand <ArrowRight /></Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}