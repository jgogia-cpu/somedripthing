import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import BlogHeroSection from "@/components/BlogHeroSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import InstagramCTA from "@/components/InstagramCTA";
import { brands, products, blogPosts, AESTHETICS, getBrandById, Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

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
  onSelect: (i: number) => void; formatPrice: (p: number) => string;
}) {
  const t = getCarouselTransform(index, currentSlide, total);
  const productBrand = getBrandById(product.brandId);
  const isActive = index === currentSlide;
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isActive) {
      navigate(`/product/${product.id}`);
    } else {
      onSelect(index);
    }
  };

  return (
    <motion.div
      animate={{ x: t.translateX, z: t.translateZ, rotateY: t.rotateY, scale: t.scale, opacity: t.opacity }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="absolute cursor-pointer group"
      style={{ zIndex: t.zIndex, transformStyle: "preserve-3d", width: "280px" }}
      onClick={handleCardClick}
    >
      <div className={`overflow-hidden rounded-2xl bg-card shadow-xl transition-shadow duration-500 ${isActive ? "shadow-2xl ring-2 ring-accent/30" : ""}`}>
        {product.brandId === "17" && (
          <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
            GET 10% OFF WITH CODE DRIPWAYAPPAREL
          </div>
        )}
        <div className="relative">
          <img src={allImages[imgIndex]} alt={product.name} className="w-full object-cover" style={{ aspectRatio: "3/4", height: "340px" }} />
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-background/90"
                onClick={(e) => { e.stopPropagation(); setImgIndex((imgIndex - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-background/90"
                onClick={(e) => { e.stopPropagation(); setImgIndex((imgIndex + 1) % allImages.length); }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {allImages.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-foreground/40"}`} />
                ))}
              </div>
            </>
          )}
          {product.newArrival && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">New</span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{productBrand?.name}</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{product.name}</p>
          <p className="mt-0.5 text-sm font-bold text-accent">{formatPrice(product.price)}</p>
        </div>
      </div>
    </motion.div>
  );
}



const heroProducts = (() => {
  // 9 picks: 2 Preview Worldwide, 1 Drip by Rage, 2 Fortune Fellas Club, 2 House of Kings, 1 Harvx, 1 MorteNoir, 1 Isolated
  // 1 each across spotlight brands incl. Maker Creator (p400)
  const fixedIds = ["p69", "p75", "p32", "p97", "p99", "p104", "p107", "p200", "p300", "p400"];
  return fixedIds.map(id => products.find(p => p.id === id)!).filter(Boolean);
})();

function getCarouselTransform(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > Math.floor(total / 2)) offset -= total;
  if (offset < -Math.floor(total / 2)) offset += total;

  const absOffset = Math.abs(offset);
  const translateX = offset * 280;
  const translateZ = -absOffset * 200;
  const rotateY = offset * -25;
  const scale = 1 - absOffset * 0.15;
  const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.25;
  const zIndex = 10 - absOffset;

  return { translateX, translateZ, rotateY, scale, opacity, zIndex };
}

const HERO_VIDEOS = [
  "/videos/hero-bg.mp4",
  "/videos/hero-bg-2.mp4",
  "/videos/hero-bg-3.mp4",
  "/videos/hero-bg-4.mp4",
];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const { formatPrice } = useCurrency();
  const trendingProducts = useMemo(() => {
    const newerBrandIds = ["19", "24", "25", "26", "27", "28", "29", "30"];
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
  const featuredBrands = brands.filter(b => b.featured).slice(0, 6);

  const nextSlide = useCallback(() => setCurrentSlide(i => (i + 1) % heroProducts.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(i => (i - 1 + heroProducts.length) % heroProducts.length), []);

  // Preload the next video on the inactive player
  useEffect(() => {
    const nextIdx = (currentVideo + 1) % HERO_VIDEOS.length;
    const inactiveVideo = activePlayer === 'A' ? videoRefB.current : videoRefA.current;
    if (inactiveVideo) {
      if (inactiveVideo.src !== window.location.origin + HERO_VIDEOS[nextIdx]) {
        inactiveVideo.src = HERO_VIDEOS[nextIdx];
        inactiveVideo.load();
      }
    }
  }, [currentVideo, activePlayer]);

  const handleVideoEnded = useCallback(() => {
    const nextIdx = (currentVideo + 1) % HERO_VIDEOS.length;
    const nextPlayer = activePlayer === 'A' ? 'B' : 'A';
    const nextVideo = nextPlayer === 'A' ? videoRefA.current : videoRefB.current;
    if (nextVideo) {
      nextVideo.play().catch(() => {});
    }
    setActivePlayer(nextPlayer);
    setCurrentVideo(nextIdx);
  }, [currentVideo, activePlayer]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const current = heroProducts[currentSlide];
  const brand = getBrandById(current.brandId);

  return (
    <div className="min-h-screen">
      {/* 3D Carousel Hero */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRefA}
            src={HERO_VIDEOS[0]}
            autoPlay
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${activePlayer === 'A' ? 'opacity-100' : 'opacity-0'}`}
            onEnded={handleVideoEnded}
          />
          <video
            ref={videoRefB}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${activePlayer === 'B' ? 'opacity-100' : 'opacity-0'}`}
            onEnded={handleVideoEnded}
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="container relative z-10">
          <h1 className="mb-1 text-center text-5xl font-bold tracking-tight md:text-7xl" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
            DRIPWAY
          </h1>
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Today's Featured Picks
          </p>
          {/* 3D Carousel */}
          <div className="relative mx-auto flex items-center justify-center" style={{ perspective: "1200px", height: "440px" }}>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
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
                <Link to="/explore">
                  <Button variant="outline" className="rounded-full">Explore All</Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Category Chips */}
      <section className="border-b py-6">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {AESTHETICS.map(tag => (
              <Link
                key={tag}
                to={`/explore?aesthetic=${tag}`}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="font-display text-2xl font-bold">Trending Now</h2>
            </div>
            <Link to="/explore?sort=trending" className="text-sm font-medium text-accent hover:underline">
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

      {/* Blog / Editorial */}
      <BlogHeroSection />

      {/* New Drops */}
      <section className="border-t bg-secondary/20 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">New Drops 🔥</h2>
            <Link to="/explore?sort=newest" className="text-sm font-medium text-accent hover:underline">
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

      {/* Featured Brand */}
      <FeaturedBrandSection />

      {/* Featured Brands */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 font-display text-2xl font-bold">Editor's Picks</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBrands.map((brand, i) => (
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
