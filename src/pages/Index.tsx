import { useEffect, useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import InstagramCTA from "@/components/InstagramCTA";
import SEO from "@/components/SEO";
import { brands, products, blogPosts, AESTHETICS, getBrandById, Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import { isRecent } from "@/lib/isRecent";
import { hideProductLocally, isHidden } from "@/lib/hiddenProducts";


// Shuffle whose result is cached in-memory for the lifetime of this JS module
// (i.e., the current page load). Navigating between routes inside the SPA
// keeps the same order, but a hard refresh / new tab reshuffles.
function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const __shuffleCache = new Map<string, string[]>();
function sessionShuffleIds(key: string, ids: string[]): string[] {
  const cached = __shuffleCache.get(key);
  if (cached) {
    const set = new Set(ids);
    const kept = cached.filter((id) => set.has(id));
    const added = ids.filter((id) => !cached.includes(id));
    const next = added.length === 0 && kept.length === cached.length ? cached : [...kept, ...shuffleArr(added)];
    __shuffleCache.set(key, next);
    return next;
  }
  const shuffled = shuffleArr(ids);
  __shuffleCache.set(key, shuffled);
  return shuffled;
}

function HeroCarouselCard({ product, index, currentSlide, total, onSelect, formatPrice }: {
  product: Product; index: number; currentSlide: number; total: number;
  onSelect: (i: number) => void; formatPrice: (p: number, native?: Product["prices"]) => string;
}) {
  const [failedImage, setFailedImage] = useState(false);
  const navigate = useNavigate();
  const t = getCarouselTransform(index, currentSlide, total);
  // Don't render off-screen cards at all — they were invisible (opacity 0) but
  // still spinning framer-motion animations and decoding images.
  if (t.opacity === 0 || failedImage || isHidden(product.id)) return null;
  const productBrand = getBrandById(product.brandId);
  const isActive = index === currentSlide;
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  // Isolated / cut-out PNGs need a lighter backdrop so they don't render as a transparent blob on the dark card.
  const isCutout =
    product.brandId === "30" ||
    /removebg|transparent|cutout|Tee2-/i.test(allImages[0] || "");
  const sized = (url: string) => {
    if (!url.includes("cdn.shopify.com") && !url.includes("dripbyrage.store")) return url;
    if (url.includes("width=")) return url;
    return url + (url.includes("?") ? "&" : "?") + "width=500";
  };

  const handleCardClick = () => {
    if (isActive) {
      navigate(`/product/${product.id}`);
    } else {
      onSelect(index);
    }
  };

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        zIndex: t.zIndex,
        transformStyle: "preserve-3d",
        width: "280px",
        opacity: t.opacity,
        transform: `translate3d(${t.translateX}px, 0, ${t.translateZ}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
        transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease",
      }}
      onClick={handleCardClick}
    >
      <div className={`overflow-hidden rounded-2xl bg-card shadow-xl transition-shadow duration-500 ${isActive ? "shadow-2xl ring-2 ring-accent/30" : ""}`}>
        {product.brandId === "17" && (
          <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
            GET 10% OFF WITH CODE DRIPWAYAPPAREL
          </div>
        )}
        <div className="relative">
          <div
            className={`relative w-full ${isCutout ? "bg-gradient-to-b from-neutral-200 to-neutral-400" : ""}`}
            style={{ height: "340px" }}
          >
            <img
              src={sized(allImages[0])}
              alt={product.name}
              loading={isActive ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full ${isCutout ? "object-contain p-4" : "object-cover"}`}
              onError={() => {
                hideProductLocally(product.id);
                setFailedImage(true);
              }}
            />
            {hasMultiple && (
              <img
                src={sized(allImages[1])}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 ${isCutout ? "object-contain p-4" : "object-cover"}`}
              />
            )}
          </div>
          {isRecent(product.addedAt) && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">New</span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{productBrand?.name}</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{product.name}</p>
          <p className="mt-0.5 text-sm font-bold text-accent">{formatPrice(product.price, product.prices)}</p>
        </div>
      </div>
    </div>
  );
}



function buildHeroProducts() {
  // Fully random lineup on every page load — pulls from every product in the
  // catalogue. Computed at render time (not module load) so hidden products
  // fetched in main.tsx have already been spliced out of `products`.
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picks = shuffled.slice(0, 12);
  const hasParris = picks.some((p) => p.brandId === "41");
  if (!hasParris) {
    const parris = products.filter((p) => p.brandId === "41");
    if (parris.length) picks[0] = parris[Math.floor(Math.random() * parris.length)];
  }
  const hasCos = picks.some((p) => p.brandId === "42");
  if (!hasCos) {
    const cos = products.filter((p) => p.brandId === "42");
    if (cos.length) picks[1] = cos[Math.floor(Math.random() * cos.length)];
  }
  const hasDrekn = picks.some((p) => p.brandId === "44");
  if (!hasDrekn) {
    const drekn = products.filter((p) => p.brandId === "44");
    if (drekn.length) {
      picks[2] = drekn[Math.floor(Math.random() * drekn.length)];
      if (drekn.length > 1) {
        const other = drekn.find((p) => p.id !== picks[2].id);
        if (other) picks[3] = other;
      }
    }
  }
  return picks;
}

function getCarouselTransform(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > Math.floor(total / 2)) offset -= total;
  if (offset < -Math.floor(total / 2)) offset += total;

  const absOffset = Math.abs(offset);
  const translateX = offset * 280;
  const translateZ = -absOffset * 200;
  const rotateY = offset * -25;
  const scale = 1 - absOffset * 0.15;
  const opacity = absOffset > 2 ? 0 : 1;
  const zIndex = 10 - absOffset;

  return { translateX, translateZ, rotateY, scale, opacity, zIndex };
}

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { formatPrice } = useCurrency();
  const heroProducts = useMemo(() => buildHeroProducts(), []);
  const trendingProducts = useMemo(() => {
    const newerBrandIds = ["19", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "42"];
    const olderBrandIds = ["17"];
    // 2 picks per newer brand (shuffled per-session), 1 per older brand
    const newerPicks = newerBrandIds.flatMap((brandId) => {
      const pool = products.filter((p) => p.brandId === brandId && p.trending);
      const order = sessionShuffleIds(`dw:trend:brand:${brandId}`, pool.map((p) => p.id));
      return order.slice(0, 2).map((id) => pool.find((p) => p.id === id)!).filter(Boolean);
    });
    const olderPicks = olderBrandIds
      .map((brandId) => {
        const pool = products.filter((p) => p.brandId === brandId && p.trending);
        const order = sessionShuffleIds(`dw:trend:brand:${brandId}`, pool.map((p) => p.id));
        return pool.find((p) => p.id === order[0]);
      })
      .filter((p): p is (typeof products)[number] => Boolean(p));
    const pickedPool = [...newerPicks, ...olderPicks];
    const pickedOrder = sessionShuffleIds("dw:trend:picked", pickedPool.map((p) => p.id));
    const picked = pickedOrder.map((id) => pickedPool.find((p) => p.id === id)!).filter(Boolean);
    const restPool = products.filter((p) => p.trending && !picked.some((g) => g.id === p.id));
    const restOrder = sessionShuffleIds("dw:trend:rest", restPool.map((p) => p.id));
    const rest = restOrder.map((id) => restPool.find((p) => p.id === id)!).filter(Boolean);
    return [...picked, ...rest].slice(0, 12);
  }, []);
  const newDropBrands = brands.filter(b => b.newDrop);

  const nextSlide = useCallback(() => setCurrentSlide(i => (i + 1) % heroProducts.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(i => (i - 1 + heroProducts.length) % heroProducts.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (heroProducts.length === 0) return null;

  const current = heroProducts[currentSlide % heroProducts.length];
  const brand = getBrandById(current.brandId);

  return (
    <div className="min-h-screen">
      <SEO
        title="DRIPWAY — Discover Niche Fashion Brands"
        description="Discover the brands Instagram won't show you. DRIPWAY is your curated discovery engine for underground, emerging, and niche streetwear and designer labels."
        path="/"
        type="website"
      />
      {/* 3D Carousel Hero */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-12 md:py-20"
        style={{ backgroundImage: `url(${heroCarouselBg.url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
        <div className="container relative z-10">
          <h1
            className="mb-1 flex flex-wrap justify-center gap-x-[0.25em] text-center text-5xl font-bold tracking-tight md:text-7xl"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
          >
            DRIPWAY
          </h1>
          <p
            className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground"
          >
            Today's Featured Picks
          </p>
          {/* 3D Carousel */}
          <div
            className="relative mx-auto flex items-center justify-center touch-pan-y select-none"
            style={{ perspective: "1200px", height: "440px" }}
            onTouchStart={(e) => {
              (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const startX = (e.currentTarget as any)._touchStartX;
              if (startX == null) return;
              const dx = e.changedTouches[0].clientX - startX;
              if (dx > 40) prevSlide();
              else if (dx < -40) nextSlide();
              (e.currentTarget as any)._touchStartX = null;
            }}
          >
            {heroProducts.map((product, i) => (
              <HeroCarouselCard
                key={product.id}
                product={product}
                index={i}
                currentSlide={currentSlide}
                total={heroProducts.length}
                onSelect={setCurrentSlide}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prevSlide} className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {heroProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Active product info */}
          <div className="mt-6 text-center">
              {brand && (
                <Link to={`/brand/${brand.slug}`} className="text-sm font-medium text-accent hover:underline">
                  {brand.name}
                </Link>
              )}
              <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">{current.name}</h2>
              <div className="mt-2 flex justify-center gap-2">
                {current.aesthetics.map(a => (
                  <span key={a} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <Link to={`/product/${current.id}`}>
                  <Button className="gap-2 rounded-full">View Product <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/collections">
                  <Button variant="outline" className="rounded-full">Browse Collections</Button>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="border-b py-6">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {AESTHETICS.map(tag => (
              <Link
                key={tag}
                to={`/collections`}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* Trending Products */}
      <section className="content-auto py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="font-display text-2xl font-bold">Trending Now</h2>
            </div>
            <Link to="/collections" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="masonry-grid">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brand — rotates daily */}
      <FeaturedBrandSection />

      {/* New Drops */}
      <section className="content-auto border-t bg-secondary/20 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">New Drops 🔥</h2>
            <Link to="/collections" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newDropBrands.map((brand, i) => (
              <BrandCard key={brand.id} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Instagram */}
      <InstagramCTA handle="@dripwayapparel" label="On The Gram" />

    </div>
  );
}
