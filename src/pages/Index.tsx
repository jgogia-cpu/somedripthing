import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import FeaturedBrandSection from "@/components/FeaturedBrandSection";
import BlogHeroSection from "@/components/BlogHeroSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import InstagramCTA from "@/components/InstagramCTA";
import { brands, products, AESTHETICS } from "@/data/brands";

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

const heroProductIds = ["p69", "p75", "p32", "p97", "p99", "p104", "p107", "p200", "p300", "p400"];

export default function Index() {
  const heroProducts = useMemo(
    () => heroProductIds.map((id) => products.find((p) => p.id === id)!).filter(Boolean),
    []
  );

  const trendingProducts = useMemo(() => {
    const newerBrandIds = ["19", "24", "25", "26", "27", "28", "29", "30", "31"];
    const olderBrandIds = ["17"];
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
    return [...picked, ...rest].slice(0, 18);
  }, []);

  const newDropBrands = brands.filter((b) => b.newDrop);
  const featuredBrands = brands.filter((b) => b.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Hero */}
      <section className="border-b bg-secondary/30">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Discovery Engine — Niche Fashion Brands
            </span>
            <h1
              className="text-3xl font-bold tracking-tight md:text-5xl"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              Find the brands no one's wearing yet.
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Live index of independent labels, refreshed weekly. Browse, save, and shop direct.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/explore"
                className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
              >
                Browse All
              </Link>
              <Link
                to="/explore?sort=trending"
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
              >
                Trending Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Strip */}
      <section className="border-b py-6">
        <div className="container">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Today's Featured Picks
            </h2>
            <Link to="/explore" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {heroProducts.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="border-b py-4">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {AESTHETICS.map((tag) => (
              <Link
                key={tag}
                to={`/explore?aesthetic=${tag}`}
                className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="border-b py-10">
        <div className="container">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h2 className="text-base font-bold uppercase tracking-wide">Trending Now</h2>
            </div>
            <Link to="/explore?sort=trending" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <BlogHeroSection />

      {/* New Drops */}
      <section className="border-b bg-secondary/30 py-10">
        <div className="container">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wide">New Drops</h2>
            <Link to="/explore?sort=newest" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newDropBrands.map((brand, i) => (
              <BrandCard key={brand.id} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </section>

      <FeaturedBrandSection />

      {/* Editor's Picks */}
      <section className="border-b py-10">
        <div className="container">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wide">Editor's Picks</h2>
            <Link to="/explore" className="text-xs font-semibold text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredBrands.map((brand, i) => (
              <BrandCard key={brand.id} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <InstagramCTA handle="@dripwayapparel" label="On The Gram" />
    </div>
  );
}
