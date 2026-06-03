import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [imgIndex, setImgIndex] = useState(0);
  const [visibleSrc, setVisibleSrc] = useState(allImages[0]);
  const [loadedSrcs, setLoadedSrcs] = useState(() => new Set<string>([allImages[0]]));
  const eager = index < 4;

  useEffect(() => {
    setImgIndex(0);
    setVisibleSrc(allImages[0]);
    setLoadedSrcs(new Set([allImages[0]]));
  }, [allImages]);

  useEffect(() => {
    if (!hasMultiple) return;

    const next = (imgIndex + 1) % allImages.length;
    const prev = (imgIndex - 1 + allImages.length) % allImages.length;
    [allImages[imgIndex], allImages[next], allImages[prev]].forEach((src) => {
      if (!src || loadedSrcs.has(src)) return;

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        setLoadedSrcs((current) => {
          if (current.has(src)) return current;
          const nextSet = new Set(current);
          nextSet.add(src);
          return nextSet;
        });
      };
      img.src = src;
    });
  }, [allImages, hasMultiple, imgIndex, loadedSrcs]);

  const changeImage = (direction: 1 | -1) => {
    setImgIndex((i) => (i + direction + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="masonry-item group"
    >
      <Link to={`/product/${product.id}`} className="block">
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
            <img
              src={visibleSrc}
              alt={product.name}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.02]"
            />
            {allImages[imgIndex] !== visibleSrc && (
              <img
                key={allImages[imgIndex]}
                src={allImages[imgIndex]}
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-0"
                onLoad={() => setVisibleSrc(allImages[imgIndex])}
              />
            )}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1.5 opacity-0 backdrop-blur-md transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); changeImage(-1); }}
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-white" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-1.5 opacity-0 backdrop-blur-md transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
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
