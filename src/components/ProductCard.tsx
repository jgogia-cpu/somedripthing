import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { isRecent } from "@/lib/isRecent";
import { hideProductLocally } from "@/lib/hiddenProducts";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  // CDN-resize Shopify images to ~500px to slash payload
  const sized = (url: string) => {
    if (!url.includes("cdn.shopify.com") && !url.includes("dripbyrage.store")) return url;
    if (url.includes("width=")) return url;
    return url + (url.includes("?") ? "&" : "?") + "width=500";
  };
  const allImages = useMemo(() => {
    const raw = product.images?.length ? product.images : [product.image];
    return raw.map(sized);
  }, [product.images, product.image]);
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  // First two rows load eagerly; everything below the fold is lazy so the
  // browser isn't fetching hundreds of images at once (that was the jank).
  const eager = index < 8;

  useEffect(() => {
    setImgIndex(0);
    setFailed(false);
  }, [allImages]);

  const changeImage = (direction: 1 | -1) => {
    setImgIndex((i) => (i + direction + allImages.length) % allImages.length);
  };

  // Hide the card entirely if the primary image can't load — dead/discontinued product.
  if (failed) return null;

  return (
    <div className="masonry-item content-auto group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/40 transition-shadow duration-200 group-hover:shadow-[0_12px_34px_-18px_hsl(var(--accent)/0.22)]">
          {product.brandId === "17" && (
            <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
              GET 10% OFF WITH CODE DRIPWAYAPPAREL
            </div>
          )}
          <div
            className="relative w-full bg-secondary/60"
            style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/5" : "1/1" }}
          >
            <img
              src={allImages[imgIndex]}
              alt={product.name}
              loading={eager ? "eager" : "lazy"}
              // @ts-expect-error - fetchpriority is a valid HTML attribute
              fetchpriority={eager ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => {
                hideProductLocally(product.id);
                setFailed(true);
              }}
            />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); changeImage(-1); }}
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-white" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-black/80"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); changeImage(1); }}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-white" />
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {allImages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-foreground/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            className={`absolute right-3 top-3 rounded-full bg-background/90 p-2 transition-opacity duration-150 ${wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            onClick={(e) => { e.preventDefault(); if (user) toggleWishlist(product.id); }}
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-accent text-accent" : ""}`} />
          </button>
          {isRecent(product.addedAt) && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground shadow-lg shadow-accent/30">
              New
            </span>
          )}
        </div>
        <div className="mt-3 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {product.brandName}
          </p>
          <p className="text-sm font-medium leading-tight text-foreground/90">{product.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">{formatPrice(product.price, product.prices)}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default memo(ProductCard);
