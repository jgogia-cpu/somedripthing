import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import BlogHeroSection from "@/components/BlogHeroSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { brands, products, blogPosts, AESTHETICS, getBrandById } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

const heroProducts = (() => {
  // Exactly 8: 2 Preview Worldwide, 2 SABR, 4 Drip by Rage
  const fixedIds = ["p69", "p70", "p92", "p93", "p28", "p29", "p30", "p31"];
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

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { formatPrice } = useCurrency();
  const trendingProducts = (() => {
    const newerBrandIds = ["19", "20", "21", "23", "24", "25"];
    const olderBrandIds = ["17", "18"];
    // 2 from each newer brand
    const newerPicks = newerBrandIds.flatMap((brandId) =>
      products.filter((p) => p.brandId === brandId && p.trending).slice(0, 2),
    );
    // 1 from each older brand
    const olderPicks = olderBrandIds
      .map((brandId) => products.find((p) => p.brandId === brandId && p.trending))
      .filter((p): p is (typeof products)[number] => Boolean(p));
    const picked = [...newerPicks, ...olderPicks];
    const rest = products.filter(
      (p) => p.trending && !picked.some((g) => g.id === p.id),
    );
    return [...picked, ...rest].slice(0, 12);
  })();
  const newDropBrands = brands.filter(b => b.newDrop);
  const featuredBrands = brands.filter(b => b.featured).slice(0, 6);

  const nextSlide = useCallback(() => setCurrentSlide(i => (i + 1) % heroProducts.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(i => (i - 1 + heroProducts.length) % heroProducts.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const current = heroProducts[currentSlide];
  const brand = getBrandById(current.brandId);

  return (
    <div className="min-h-screen">
      {/* 3D Carousel Hero */}
      <section className="relative overflow-hidden bg-secondary/30 py-12 md:py-20">
        <div className="container">
          <h1 className="mb-1 text-center text-5xl font-bold tracking-tight md:text-7xl" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
            DRIPWAY
          </h1>
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Today's Featured Picks
          </p>
          {/* 3D Carousel */}
          <div className="relative mx-auto flex items-center justify-center" style={{ perspective: "1200px", height: "440px" }}>
            {heroProducts.map((product, i) => {
              const t = getCarouselTransform(i, currentSlide, heroProducts.length);
              const productBrand = getBrandById(product.brandId);
              const isActive = i === currentSlide;
              return (
                <motion.div
                  key={product.id}
                  animate={{
                    x: t.translateX,
                    z: t.translateZ,
                    rotateY: t.rotateY,
                    scale: t.scale,
                    opacity: t.opacity,
                  }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute cursor-pointer"
                  style={{
                    zIndex: t.zIndex,
                    transformStyle: "preserve-3d",
                    width: "280px",
                  }}
                  onClick={() => setCurrentSlide(i)}
                >
                  <div className={`overflow-hidden rounded-2xl bg-card shadow-xl transition-shadow duration-500 ${isActive ? "shadow-2xl ring-2 ring-accent/30" : ""}`}>
                    {product.brandId === "17" && (
                      <div className="bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
                        GET 10% OFF WITH CODE DRIPWAYAPPAREL
                      </div>
                    )}
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full object-cover"
                        style={{ aspectRatio: "3/4", height: "340px" }}
                      />
                      {product.newArrival && (
                        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                          New
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {productBrand?.name}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold">{product.name}</p>
                      <p className="mt-0.5 text-sm font-bold text-accent">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Featured Brand */}
      <FeaturedBrandSection />

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

    </div>
  );
}
