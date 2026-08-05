import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, getBrandById } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import SEO from "@/components/SEO";
import RecentlyViewed from "@/components/RecentlyViewed";
import { hideProductLocally } from "@/lib/hiddenProducts";

/** Return the Monday of the current week as a Date */
function getCurrentMonday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // Mon = 1
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
  return monday;
}

/** Simple seeded PRNG (mulberry32) */
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Deterministic shuffle using a seed */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getWeeklyCollection() {
  const monday = getCurrentMonday();
  // Seed from the Monday date so it changes each week
  const seed = monday.getFullYear() * 10000 + (monday.getMonth() + 1) * 100 + monday.getDate();
  const shuffled = seededShuffle(products, seed);
  // No brand binding — any brand, any product, any order, fully randomized weekly.
  // Guarantee ParrisHighOnFashion (brandId 41) leads the week.
  const parris = products.filter((p) => p.brandId === "41");
  const parrisIdx = seed % Math.max(parris.length, 1);
  const leadParris = parris[parrisIdx];
  const rest = shuffled.filter((p) => p.id !== leadParris?.id).slice(0, 7);
  const picks = leadParris ? [leadParris, ...rest] : shuffled.slice(0, 8);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateLabel = `Week of ${monthNames[monday.getMonth()]} ${monday.getDate()}, ${monday.getFullYear()}`;

  return {
    title: "Heat Check",
    subtitle: "This Week's Must-Haves",
    description:
      "Our editors hand-picked the hardest pieces dropping this week — from statement leather to heritage streetwear. No filler, just heat.",
    date: dateLabel,
    picks,
  };
}

export default function Collections() {
  const { formatPrice } = useCurrency();
  const collection = useMemo(() => getWeeklyCollection(), []);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!query) return null;

    // Levenshtein distance (small, bounded)
    const lev = (a: string, b: string): number => {
      if (a === b) return 0;
      if (!a.length) return b.length;
      if (!b.length) return a.length;
      const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= b.length; j++) {
          const tmp = dp[j];
          dp[j] =
            a[i - 1] === b[j - 1]
              ? prev
              : 1 + Math.min(prev, dp[j], dp[j - 1]);
          prev = tmp;
        }
      }
      return dp[b.length];
    };

    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const queryTokens = normalize(query).split(" ").filter(Boolean);
    if (!queryTokens.length) return [];

    const fuzzyTokenMatch = (qTok: string, haystackTokens: string[]) => {
      // Allow more typos for longer words
      const tolerance = qTok.length <= 3 ? 0 : qTok.length <= 5 ? 1 : qTok.length <= 8 ? 2 : 3;
      let best = Infinity;
      for (const hTok of haystackTokens) {
        if (hTok.includes(qTok) || qTok.includes(hTok)) return 0; // substring / prefix
        if (Math.abs(hTok.length - qTok.length) > tolerance + 2) continue;
        const d = lev(qTok, hTok);
        if (d < best) best = d;
        if (best === 0) return 0;
      }
      return best <= tolerance ? best : -1;
    };

    const scored = products
      .map((p) => {
        const brand = getBrandById(p.brandId);
        const text = normalize(
          [p.name, p.description, brand?.name, ...(p.aesthetics || [])]
            .filter(Boolean)
            .join(" "),
        );
        const fullPhrase = text;
        const hayTokens = text.split(" ").filter(Boolean);

        let score = 0;
        let matchedAll = true;

        // Strong boost for raw substring of the whole query
        const rawQ = normalize(query);
        if (rawQ && fullPhrase.includes(rawQ)) score += 50;

        for (const qTok of queryTokens) {
          const d = fuzzyTokenMatch(qTok, hayTokens);
          if (d < 0) {
            matchedAll = false;
            break;
          }
          score += 10 - d * 2; // closer = better
        }

        return matchedAll ? { p, score } : null;
      })
      .filter((x): x is { p: typeof products[number]; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);

    return scored;
  }, [query]);

  const collectionProducts = searchResults ?? collection.picks;
  const isSearching = !!searchResults;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={isSearching ? `Search: ${query} | DRIPWAY` : "Heat Check — Weekly Collections | DRIPWAY"}
        description={
          isSearching
            ? `Search results for "${query}" across DRIPWAY brands and drops.`
            : "Weekly curated 'Heat Check' collections of the hottest niche fashion picks, refreshed every Monday on DRIPWAY."
        }
        path="/collections"
      />
      {/* Hero */}
      <section className="relative bg-primary py-20 text-primary-foreground md:py-28">
        <div className="container">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSearching ? (
              <>
                <div className="flex items-center gap-2 text-primary-foreground/60">
                  <SearchIcon className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-widest">Search results</span>
                </div>
                <h1
                  className="mt-3 text-4xl font-bold tracking-tight md:text-6xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "{query}"
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/60">
                  {collectionProducts.length} {collectionProducts.length === 1 ? "result" : "results"} across DRIPWAY brands.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-primary-foreground/60">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-widest">{collection.date}</span>
                </div>
                <h1
                  className="mt-3 text-5xl font-bold tracking-tight md:text-7xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {collection.title}
                </h1>
                <p
                  className="mt-2 text-2xl font-light text-primary-foreground/80 md:text-3xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {collection.subtitle}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/60">
                  {collection.description}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <RecentlyViewed />

      {/* Collection Grid — blog-style large images */}
      <section className="py-16">
        <div className="container">
          {isSearching && collectionProducts.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/40 p-10 text-center">
              <p className="text-lg font-semibold">No matches for "{query}"</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a brand name, aesthetic, or category.</p>
              <Link to="/collections" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
                Back to Heat Check →
              </Link>
            </div>
          )}
          <div className="space-y-20">
            {collectionProducts.map((product, i) => {
              const brand = getBrandById(product.brandId);
              const isEven = i % 2 === 0;
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`flex flex-col gap-8 md:flex-row md:items-center ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Large Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="group flex-1 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        hideProductLocally(product.id);
                        e.currentTarget.closest("article")?.remove();
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Pick #{i + 1}
                    </span>
                    {brand && (
                      <Link
                        to={`/brand/${brand.slug}`}
                        className="mt-2 text-sm font-medium text-accent hover:underline"
                      >
                        {brand.name}
                      </Link>
                    )}
                    <h2
                      className="mt-1 text-3xl font-bold leading-tight md:text-4xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.name}
                    </h2>
                    <p className="mt-3 text-lg font-bold text-accent">
                      {formatPrice(product.price, product.prices)}
                      {product.originalPrice && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.aesthetics.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link to={`/product/${product.id}`}>
                        <Button className="rounded-full gap-2">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Want more?
          </h2>
          <p className="mt-2 text-primary-foreground/60">
            New collection drops every week. Stay in the loop.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/collections">
              <Button
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Browse Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
