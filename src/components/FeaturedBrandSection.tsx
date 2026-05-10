import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, getBrandById, Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

const dripByRageProducts = products.filter(p => p.brandId === "17").slice(0, 6);
const brand = getBrandById("17")!;

function FeaturedProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-black/90 shadow-lg transition-shadow hover:shadow-xl">
        <div className="relative">
          <img
            src={allImages[imgIndex]}
            alt={product.name}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ aspectRatio: "3/4", height: "360px" }}
          />
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
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
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            {product.brandName}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">{product.name}</p>
          <p className="mt-0.5 text-sm font-bold text-white">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBrandSection() {
  return (
    <section className="border-b bg-foreground py-12 text-background">
      <div className="container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">Featured Brand</p>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">{brand.name}</h2>
            <p className="mt-1 text-xs text-background/70">
              10% off with code{" "}
              <TrackedOutboundLink
                href="https://dripbyrage.com/dripwayapparel"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-background underline-offset-2 hover:underline"
                trackingProperties={{
                  brand_id: brand.id,
                  brand_name: brand.name,
                  brand_slug: brand.slug,
                  click_type: "promo",
                  source: "featured_brand_promo",
                }}
              >
                DRIPWAYAPPAREL
              </TrackedOutboundLink>
            </p>
          </div>
          <Link to={`/brand/${brand.slug}`}>
            <Button className="gap-2 rounded-md bg-background text-foreground hover:bg-background/90">
              View Brand <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {dripByRageProducts.map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
