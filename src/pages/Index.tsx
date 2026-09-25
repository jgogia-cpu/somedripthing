import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import InstagramCTA from "@/components/InstagramCTA";
import SEO from "@/components/SEO";
import { brands, products, getBrandById, type Product } from "@/data/brands";
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

function EditorialProduct({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const brand = getBrandById(product.brandId);

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <article className="h-full border-b border-border p-4 transition-colors duration-300 last:border-b-0 hover:bg-card sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-6">
        <div className="aspect-[3/4] overflow-hidden bg-secondary">
          <img src={product.images?.[0] || product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold uppercase">{product.name}</h3>
            <p className="mt-1 text-[10px] uppercase text-muted-foreground">{brand?.name}</p>
          </div>
          <span className="shrink-0 text-xs">{formatPrice(product.price, product.prices)}</span>
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
  const trendingProducts = useMemo(() => shuffle(products.filter((product) => product.trending && !forbidden.has(product.brandName))).slice(0, 3), []);
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
  const heroImage = current.images?.[0] || current.image;

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SEO title="DRIPWAY — Discover Niche Fashion Brands" description="Discover the brands Instagram won't show you. DRIPWAY is your curated discovery engine for underground, emerging, and niche streetwear and designer labels." path="/" type="website" />

      <section className="container pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="flex items-end justify-between border-b border-border pb-4 text-[9px] font-medium uppercase text-muted-foreground md:text-[10px]">
          <span>Est. 2024</span>
          <span className="hidden md:block">Independent fashion discovery</span>
          <span>{String(currentSlide + 1).padStart(2, "0")} / {String(heroProducts.length).padStart(2, "0")}</span>
        </div>
        <h1 className="select-none py-3 text-center font-display text-[clamp(5rem,18vw,16rem)] font-normal leading-[0.78] text-foreground md:py-5">DRIPWAY</h1>

        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-card sm:aspect-[16/10] lg:aspect-[21/9]">
          <img key={heroImage} src={heroImage} alt={`${currentBrand?.name ?? current.brandName} editorial`} fetchPriority="high" className="h-full w-full animate-fade-in object-cover object-center" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/65 to-transparent" />
          <Button variant="outline" size="icon" onClick={prevSlide} aria-label="Previous cover" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-none border-foreground/30 bg-background/60 backdrop-blur-sm"><ChevronLeft /></Button>
          <Button variant="outline" size="icon" onClick={nextSlide} aria-label="Next cover" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-none border-foreground/30 bg-background/60 backdrop-blur-sm"><ChevronRight /></Button>
        </div>

        <div className="mt-8 grid gap-8 border-t border-border pt-6 md:grid-cols-12 md:items-end">
          <p className="max-w-md text-sm uppercase leading-relaxed text-muted-foreground md:col-span-5">A considered edit of independent labels shaping fashion beyond the algorithm.</p>
          <div className="md:col-span-4 md:col-start-7">
            <p className="text-[10px] font-medium uppercase text-accent">{currentBrand?.name}</p>
            <h2 className="mt-2 font-display text-3xl leading-none md:text-4xl">{current.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{formatPrice(current.price, current.prices)}</p>
          </div>
          <Link to={`/product/${current.id}`} className="group inline-flex items-center justify-between gap-5 text-xs font-semibold uppercase md:col-span-2 md:justify-self-end">
            View piece <span className="h-px w-10 bg-foreground transition-[width] group-hover:w-16" />
          </Link>
        </div>
      </section>

      <section id="trending" className="border-y border-border py-20 md:py-28">
        <div className="container">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div><p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Curated selection</p><h2 className="font-display text-5xl italic leading-none md:text-7xl">Trending now</h2></div>
            <Link to="/collections" className="hidden items-center gap-2 text-xs font-semibold uppercase md:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid border border-border sm:grid-cols-3">
            {trendingProducts.map((product) => <EditorialProduct key={product.id} product={product} />)}
          </div>
          <Link to="/collections" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase md:hidden">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <FeaturedBrandSection />

      <section className="border-b border-border py-20 md:py-28">
        <div className="container">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div><p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Fresh arrivals</p><h2 className="font-display text-5xl italic leading-none md:text-7xl">New drops</h2></div>
            <Link to="/brands" className="hidden items-center gap-2 text-xs font-semibold uppercase md:inline-flex">All brands <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleDropBrands.map((brand, index) => <BrandCard key={brand.id} brand={brand} index={index} />)}
          </div>
          {newDropBrands.length > 4 && <div className="mt-10 flex justify-center"><Button variant="outline" onClick={() => setShowAllDrops((value) => !value)} className="rounded-none border-foreground/30 px-7 uppercase">{showAllDrops ? "Show less" : `More brands (${newDropBrands.length - 4})`}<ChevronDown className={showAllDrops ? "rotate-180" : ""} /></Button></div>}
        </div>
      </section>

      <RecentlyViewed />
      <NewsletterSignup />
      <InstagramCTA handle="@dripwayapparel" label="On The Gram" />
    </main>
  );
}
