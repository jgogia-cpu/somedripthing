import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  // CDN-resize Shopify images to ~600px to slash payload
  const sized = (url: string) => {
    if (!url.includes("cdn.shopify.com") && !url.includes("dripbyrage.store")) return url;
    if (url.includes("width=")) return url;
    return url + (url.includes("?") ? "&" : "?") + "width=600";
  };
  const eager = index < 4;

  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-md border border-border bg-secondary/40 transition-colors duration-200 group-hover:border-foreground/30">
          {product.brandId === "17" && (
            <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
              GET 10% OFF WITH CODE DRIPWAYAPPAREL
            </div>
          )}
          <img
            src={sized(allImages[imgIndex])}
            alt={product.name}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
            className="w-full object-cover"
            style={{ aspectRatio: "1/1" }}
          />
          {/* Image navigation arrows */}
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-background/90"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-background/90"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex + 1) % allImages.length); }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {allImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-foreground/40"}`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            className={`absolute right-3 top-3 rounded-full bg-background/70 p-2 backdrop-blur-md transition-all duration-300 ${wishlisted ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"}`}
            onClick={(e) => { e.preventDefault(); if (user) toggleWishlist(product.id); }}
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-accent text-accent" : ""}`} />
          </button>
          {product.newArrival && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground shadow-lg shadow-accent/30">
              New
            </span>
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {product.brandName}
          </p>
          <p className="truncate text-sm font-medium leading-tight text-foreground">{product.name}</p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <p className="text-sm font-bold tabular-nums text-foreground">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs tabular-nums text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
