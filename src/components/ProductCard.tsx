import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
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
  const [hovered, setHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const intervalRef = useRef<number | null>(null);
  const eager = index < 4;

  // Preload the rest of the gallery on first hover so we never crossfade
  // into an image that hasn't loaded (which causes the black flash).
  const preloadedRef = useRef(false);
  useEffect(() => {
    if (!hovered || preloadedRef.current || !hasMultiple) return;
    preloadedRef.current = true;
    allImages.forEach((src, i) => {
      if (i === 0) return;
      const img = new Image();
      img.onload = () => setLoaded((prev) => {
        if (prev.has(i)) return prev;
        const next = new Set(prev);
        next.add(i);
        return next;
      });
      img.src = src;
    });
  }, [hovered, hasMultiple, allImages]);

  // Cycle through only the images that are actually loaded — never skip to
  // an empty slot (that's what caused the flash to dark background).
  useEffect(() => {
    if (!hovered || !hasMultiple) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setImgIndex(0);
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setImgIndex((i) => {
        // pick the next index in order that is already loaded
        for (let step = 1; step <= allImages.length; step++) {
          const candidate = (i + step) % allImages.length;
          if (loaded.has(candidate)) return candidate;
        }
        return i;
      });
    }, 1600);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [hovered, hasMultiple, allImages.length, loaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="masonry-item group"
    >
      <Link
        to={`/product/${product.id}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl bg-secondary/50 transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-black/10">
          {product.brandId === "17" && (
            <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
              GET 10% OFF WITH CODE DRIPWAYAPPAREL
            </div>
          )}
          <div
            className="relative w-full bg-secondary/60"
            style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/5" : "1/1" }}
          >
            {/* First image is always rendered — stays under crossfades so
                the background never goes black between transitions. */}
            <img
              src={allImages[0]}
              alt={product.name}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : "auto"}
              onLoad={() => setLoaded((p) => (p.has(0) ? p : new Set(p).add(0)))}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Secondary images crossfade on top once loaded */}
            {allImages.slice(1).map((src, i) => {
              const realIdx = i + 1;
              const isActive = imgIndex === realIdx && loaded.has(realIdx);
              return (
                <img
                  key={realIdx}
                  src={preloadedRef.current ? src : undefined}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[600ms] ease-out ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              );
            })}
            {hasMultiple && hovered && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {allImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-foreground/40"}`}
                  />
                ))}
              </div>
            )}
          </div>
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
        <div className="mt-3 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {product.brandName}
          </p>
          <p className="text-sm font-medium leading-tight text-foreground/90">{product.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
