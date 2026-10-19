import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import SEO from "@/components/SEO";
import { brands, products, getBrandById, HERO_MODEL_IMAGES, type Product } from "@/data/brands";
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

interface HeroSlide {
  product?: Product;
  brandSlug: string;
  brandName: string;
  image: string;
}

function buildHeroSlides(): HeroSlide[] {
  const eligibleImages = HERO_MODEL_IMAGES.filter(({ brandId }) => {
    const brand = getBrandById(brandId);
    return brand && !forbidden.has(brand.name);
  });

  return shuffle(eligibleImages).flatMap(({ brandId, image }) => {
    const brand = getBrandById(brandId);
    if (!brand) return [];
    // Pair the photo with the product it actually shows; if the shot isn't a
    // specific catalogue product, the slide links to the brand page instead.
    const product = products.find(
      (item) => item.brandId === brandId && (item.image === image || item.images?.includes(image))
    );
    return [{ product, brandSlug: brand.slug, brandName: brand.name, image }];
  });
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
  const heroSlides = useMemo(buildHeroSlides, []);
  const trendingProducts = useMemo(() => shuffle(products.filter((product) => product.trending && !forbidden.has(product.brandName))).slice(0, 3), []);
  const newDropBrands = useMemo(() => [...brands]
    .filter((brand) => brand.newDrop && !forbidden.has(brand.name))
    .sort((a, b) => String(b.addedAt ?? "").localeCompare(String(a.addedAt ?? ""))), []);
  const visibleDropBrands = showAllDrops ? newDropBrands : newDropBrands.slice(0, 4);

  const nextSlide = useCallback(() => setCurrentSlide((value) => (value + 1) % heroSlides.length), [heroSlides.length]);
  const prevSlide = useCallback(() => setCurrentSlide((value) => (value - 1 + heroSlides.length) % heroSlides.length), [heroSlides.length]);

  useEffect(() => {
    if (!heroSlides.length) return;
    const timer = window.setInterval(nextSlide, 7000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length, nextSlide]);

  if (!heroSlides.length) return null;
  const { product: current, brandSlug, brandName, image: heroImage } = heroSlides[currentSlide];

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SEO title="DRIPWAY — Discover Niche Fashion Brands" description="Discover the brands Instagram won't show you. DRIPWAY is your curated discovery engine for underground, emerging, and niche streetwear and designer labels." path="/" type="website" />

      <section className="relative -mt-16 h-[100svh] min-h-[600px] overflow-hidden bg-card">
        <img key={heroImage} src={heroImage} alt={`${brandName} editorial`} fetchPriority="high" className="absolute inset-0 h-full w-full animate-fade-in object-cover object-[center_18%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/85" />
        <div className="relative flex h-full flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pb-10">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.32em] text-foreground/80">
            <span>Est. 2024</span>
            <span>{String(currentSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span>
          </div>
          <div>
            <h1 className="select-none font-display text-[clamp(4.5rem,17vw,15rem)] leading-[0.8] text-foreground">DRIPWAY</h1>
            <div className="mt-6 flex flex-col gap-6 border-t border-foreground/25 pt-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/70">{brandName}</p>
                <p className="mt-2 font-display text-2xl leading-none md:text-3xl">{current ? current.name : brandName}</p>
                {current && <p className="mt-2 text-sm text-foreground/70">{formatPrice(current.price, current.prices)}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={prevSlide} aria-label="Previous cover" className="rounded-none border-foreground/30 bg-transparent"><ChevronLeft /></Button>
                <Button variant="outline" size="icon" onClick={nextSlide} aria-label="Next cover" className="rounded-none border-foreground/30 bg-transparent"><ChevronRight /></Button>
                <Link to={current ? `/product/${current.id}` : `/brand/${brandSlug}`} className="group ml-4 inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em]">
                  {current ? "View piece" : "View brand"} <span className="h-px w-10 bg-foreground transition-[width] group-hover:w-16" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trending" className="border-y border-border py-20 md:py-28">
        <div className="container">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div><p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Curated selection</p><h2 className="font-display text-5xl leading-none md:text-7xl">Trending now</h2></div>
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
            <div><p className="mb-2 text-[10px] font-medium uppercase text-muted-foreground">Fresh arrivals</p><h2 className="font-display text-5xl leading-none md:text-7xl">New drops</h2></div>
            <Link to="/brands" className="inline-flex items-center gap-2 text-xs font-semibold uppercase">Brand directory <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ol className="border-t border-border">
            {visibleDropBrands.map((brand, index) => (
              <li key={brand.id} className="border-b border-border">
                <Link to={`/brand/${brand.slug}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[5rem_1fr_16rem] md:py-8">
                  <span className="text-xs tracking-[0.2em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display text-3xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-6xl">{brand.name}</span>
                  {(brand.lookbook?.[0] || brand.banner || brand.logo) && (
                    <span className="block aspect-[4/3] w-24 overflow-hidden bg-card md:w-64">
                      <img src={brand.lookbook?.[0] || brand.banner || brand.logo} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
          {newDropBrands.length > 4 && <div className="mt-10 flex justify-center"><Button variant="outline" onClick={() => setShowAllDrops((value) => !value)} className="rounded-none border-foreground/30 px-7 uppercase">{showAllDrops ? "Show less" : `More brands (${newDropBrands.length - 4})`}<ChevronDown className={showAllDrops ? "rotate-180" : ""} /></Button></div>}
        </div>
      </section>

      <RecentlyViewed />
      <NewsletterSignup />
    </main>
  );
}
