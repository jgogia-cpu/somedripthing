import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands, products, Product, Brand } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { hideProductLocally, isHidden } from "@/lib/hiddenProducts";

// Deterministic per-day rotation across all featured brands so every visitor
// on the same UTC day sees the same "Today's Featured Brand", and it changes
// automatically at midnight UTC.
function pickDailyFeaturedBrand(): Brand {
  // Sort by id so the pool order is fixed regardless of future edits to the
  // brands array — guarantees the same brand shows for the entire UTC day.
  const pool = brands
    .filter((b) => b.featured)
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
  const now = new Date();
  const dayIndex = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000
  );
  return pool[dayIndex % pool.length];
}

function FeaturedProductCard({ product, textTone }: { product: Product; textTone: "light" | "dark" }) {
  const { formatPrice } = useCurrency();
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const [failedImage, setFailedImage] = useState(false);
  const isLight = textTone === "light";

  if (failedImage || isHidden(product.id)) return null;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className={`overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl ${isLight ? "bg-black/90" : "bg-white"}`}>
        <div className="relative">
          <img
            src={allImages[imgIndex]}
            alt={product.name}
            loading="lazy"
            className="w-full object-cover"
            style={{ aspectRatio: "3/4", height: "360px" }}
            onError={() => {
              hideProductLocally(product.id);
              setFailedImage(true);
            }}
          />
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex + 1) % allImages.length); }}
              >
                <ChevronRight className="h-3.5 w-3.5 text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {allImages.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
          {product.newArrival && (
            <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-0.5 text-xs font-bold text-white">
              New
            </span>
          )}
        </div>
        <div className="p-4">
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? "text-white/50" : "text-black/50"}`}>
            {product.brandName}
          </p>
          <p className={`mt-0.5 truncate text-sm font-semibold ${isLight ? "text-white" : "text-black"}`}>{product.name}</p>
          <p className={`mt-0.5 text-sm font-bold ${isLight ? "text-white" : "text-black"}`}>{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBrandSection() {
  const brand = useMemo(() => pickDailyFeaturedBrand(), []);
  const brandProducts = useMemo(
    () => products.filter((p) => p.brandId === brand.id && !isHidden(p.id)).slice(0, 6),
    [brand.id]
  );
  const bg = brand.themeColor ?? "hsl(16, 85%, 60%)";
  const tone: "light" | "dark" = brand.themeTextTone ?? "dark";
  const isLight = tone === "light";
  const headerText = isLight ? "text-white" : "text-black";
  const headerMuted = isLight ? "text-white/60" : "text-black/50";
  const btnClass = isLight
    ? "gap-2 rounded-full bg-white text-black hover:bg-white/90"
    : "gap-2 rounded-full bg-black text-white hover:bg-black/80";

  if (brandProducts.length === 0) return null;

  return (
    <section className="py-16 transition-colors" style={{ backgroundColor: bg }}>
      <div className="container">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-widest ${headerMuted}`}>Today's Featured Brand</p>
            <h2
              className={`text-4xl font-black uppercase md:text-6xl ${headerText}`}
              style={{ fontFamily: brand.logoFont ?? "'Inter', sans-serif", letterSpacing: "0.02em", lineHeight: 1 }}
            >
              {brand.name}
            </h2>
          </div>
          <Link to={`/brand/${brand.slug}`} className="shrink-0">
            <Button className={btnClass}>
              View Brand <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandProducts.map((product) => (
            <div key={product.id} className="content-auto">
              <FeaturedProductCard product={product} textTone={tone} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
