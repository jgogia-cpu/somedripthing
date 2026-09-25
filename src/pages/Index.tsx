import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import InstagramCTA from "@/components/InstagramCTA";
import SEO from "@/components/SEO";
import { brands, products, AESTHETICS, getBrandById, type Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import RecentlyViewed from "@/components/RecentlyViewed";

const forbidden = new Set(["Apollo Originals", "Christopher Noir", "VeroBottega"]);

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildHeroProducts() {
  return shuffle(products.filter((product) => {
    const brand = getBrandById(product.brandId);
    return brand && !forbidden.has(brand.name) && (brand.lookbook?.length || brand.banner);
  })).slice(0, 8);
}

function EditorialProduct({ product, featured = false, index = 0 }: { product: Product; featured?: boolean; index?: number }) {
  const { formatPrice } = useCurrency();
  const brand = getBrandById(product.brandId);

  if (!featured) return <ProductCard product={product} index={index} />;

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <article className="relative h-full min-h-[520px] overflow-hidden border border-border bg-card md:min-h-[760px]">
        <img src={product.images?.[0] || product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">Cover story · {brand?.name}</p>
          <h3 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.02] md:text-6xl">{product.name}</h3>
          <div className="mt-5 flex items-center justify-between border-t border-foreground/30 pt-4 text-sm font-semibold uppercase tracking-[0.15em]">
            <span>{formatPrice(product.price, product.prices)}</span>
            <span className="inline-flex items-center gap-2">View piece <ArrowRight className="h-4 w-4" /></span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllDrops, setShowAllDrops] = useState(false);
  const { formatPrice } = useCurrency();
  const heroProducts = useMemo(buildHeroProducts, []);
  const trendingProducts = useMemo(() => shuffle(products.filter((product) => product.trending && !forbidden.has(product.brandName))).slice(0, 9), []);
  const newDropBrands = useMemo(() => [...brands]
    .filter((brand) => brand.newDrop && !forbidden.has(brand.name))
    .sort((a, b) => String(b.addedAt ?? "").localeCompare(String(a.addedAt ?? ""))), []);
  const visibleDropBrands = showAllDrops ? newDropBrands : newDropBrands.slice(0, 4);

  const nextSlide = useCallback(() => setCurrentSlide((value) => (value + 1) % heroProducts.length), [heroProducts.length]);
  const prevSlide = useCallback(() => setCurrentSlide((value) => (value - 1 + heroProducts.length) % heroProducts.length), [heroProducts.length]);

  useEffect(() => {
    if (!heroProducts.length) return;
    const timer = window.setInterval(nextSlide, 7000);
    return () => window.clearInterval(timer);
  }, [heroProducts.length, nextSlide]);

  if (!heroProducts.length) return null;
  const current = heroProducts[currentSlide];
  const currentBrand = getBrandById(current.brandId);
  const heroImage = currentBrand?.lookbook?.[0] || currentBrand?.banner || current.image;

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SEO title="DRIPWAY — Discover Niche Fashion Brands" description="Discover the brands Instagram won't show you. DRIPWAY is your curated discovery engine for underground, emerging, and niche streetwear and designer labels." path="/" type="website" />

      <section className="relative flex h-[calc(100svh-4rem)] min-h-[620px] max-h-[920px] items-center overflow-hidden border-b border-foreground/20">
        <img key={heroImage} src={heroImage} alt={`${currentBrand?.name ?? current.brandName} editorial`} fetchPriority="high" className="absolute inset-0 h-full w-full animate-fade-in object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/5 to-background/90" />
        <div className="absolute inset-0 bg-background/10" />

        <div className="container relative z-10 flex h-full flex-col justify-between py-7 md:py-10">
          <div className="flex items-start justify-between text-[9px] font-semibold uppercase tracking-[0.32em] text-foreground/80 md:text-[10px]">
            <div><p>Issue 001</p><p className="mt-1 text-foreground/50">The independent edition</p></div>
            <p className="hidden md:block">Global fashion discovery</p>
          </div>

          <h1 className="select-none text-center font-display text-[clamp(4rem,17vw,15rem)] font-bold italic leading-[0.72] text-foreground drop-shadow-2xl">DRIPWAY</h1>

          <div className="grid gap-6 border-t border-foreground/30 pt-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <p className="max-w-md font-display text-xl leading-tight md:text-3xl">A new perspective on independent fashion culture.</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Featured: {currentBrand?.name}</p>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <h2 className="line-clamp-2 text-xl font-semibold md:text-2xl">{current.name}</h2>
              <p className="mt-1 text-sm text-foreground/70">{formatPrice(current.price, current.prices)}</p>
              <div className="mt-4 flex gap-2">
                <Button asChild size="lg" className="flex-1 rounded-none uppercase tracking-[0.12em]"><Link to={`/product/${current.id}`}>Shop feature <ArrowRight /></Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-foreground/40 bg-background/30 backdrop-blur-md"><Link to="/collections">Explore</Link></Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/2 left-4 z-20 hidden -translate-y-1/2 xl:block"><Button variant="outline" size="icon" onClick={prevSlide} aria-label="Previous cover" className="rounded-none border-foreground/30 bg-background/20 backdrop-blur-md"><ChevronLeft /></Button></div>
        <div className="absolute bottom-1/2 right-4 z-20 hidden -translate-y-1/2 xl:block"><Button variant="outline" size="icon" onClick={nextSlide} aria-label="Next cover" className="rounded-none border-foreground/30 bg-background/20 backdrop-blur-md"><ChevronRight /></Button></div>
        <a href="#trending" aria-label="Continue to trending" className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 md:block"><ArrowDown className="h-5 w-5 animate-bounce" /></a>
      </section>

      <nav aria-label="Shop by aesthetic" className="border-b border-border bg-background py-4">
        <div className="container flex gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {AESTHETICS.map((tag, index) => <Link key={tag} to="/collections" className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-accent"><span className="mr-2 text-accent">{String(index + 1).padStart(2, "0")}</span>{tag}</Link>)}
        </div>
      </nav>

      <RecentlyViewed />

      <section id="trending" className="border-b border-border py-16 md:py-24">
        <div className="container">
          <div className="mb-10 grid gap-5 border-t border-border pt-4 md:grid-cols-12 md:items-end">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent md:col-span-3">01 · The edit</p>
            <h2 className="font-display text-5xl font-bold leading-none md:col-span-7 md:text-8xl">Trending now</h2>
            <Link to="/collections" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] md:justify-self-end">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:row-span-2"><EditorialProduct product={trendingProducts[0]} featured /></div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-5">{trendingProducts.slice(1, 5).map((product, index) => <EditorialProduct key={product.id} product={product} index={index} />)}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{trendingProducts.slice(5, 9).map((product, index) => <EditorialProduct key={product.id} product={product} index={index + 5} />)}</div>
        </div>
      </section>

      <FeaturedBrandSection />

      <section className="border-b border-border py-16 md:py-24">
        <div className="container">
          <div className="mb-10 grid gap-5 border-t border-border pt-4 md:grid-cols-12 md:items-end">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent md:col-span-3">03 · Fresh arrivals</p>
            <h2 className="font-display text-5xl font-bold leading-none md:col-span-7 md:text-8xl">New drops</h2>
            <Link to="/brands" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] md:justify-self-end">All brands <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {visibleDropBrands.map((brand, index) => <div key={brand.id} className={index % 4 === 0 || index % 4 === 3 ? "lg:col-span-7" : "lg:col-span-5"}><BrandCard brand={brand} index={index} /></div>)}
          </div>
          {newDropBrands.length > 4 && <div className="mt-10 flex justify-center"><Button variant="outline" onClick={() => setShowAllDrops((value) => !value)} className="rounded-none border-foreground/30 px-7 uppercase tracking-[0.15em]">{showAllDrops ? "Show less" : `More brands (${newDropBrands.length - 4})`}<ChevronDown className={showAllDrops ? "rotate-180" : ""} /></Button></div>}
        </div>
      </section>

      <NewsletterSignup />
      <InstagramCTA handle="@dripwayapparel" label="On The Gram" />
    </main>
  );
}