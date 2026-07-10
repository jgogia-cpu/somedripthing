import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ExternalLink, Instagram, ArrowLeft, MapPin, Calendar, Star, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { getBrandBySlug, getProductsByBrand, getSimilarBrands } from "@/data/brands";
import { useScrapedProducts } from "@/hooks/useScrapedProducts";
import InstagramGrid from "@/components/InstagramGrid";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const PRICE_TIER_SYMBOLS: Record<string, string> = {
  budget: "$",
  mid: "$$",
  premium: "$$$",
  luxury: "$$$$",
};
const PRICE_TIER_LABELS: Record<string, string> = {
  budget: "Entry",
  mid: "Mid",
  premium: "Premium",
  luxury: "Luxury",
};
const priceTierSymbol = (t: string) => PRICE_TIER_SYMBOLS[t] ?? "$$";
const priceTierLabel = (t: string) => PRICE_TIER_LABELS[t] ?? "Mid";

export default function BrandProfile() {
  const { slug } = useParams<{ slug: string }>();
  const brand = getBrandBySlug(slug || "");
  const [storyExpanded, setStoryExpanded] = useState(false);

  if (!brand) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg">Brand not found.</p>
        <Link to="/collections" className="mt-4 text-sm text-accent hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const scraped = useScrapedProducts();
  const brandProducts = useMemo(() => {
    const staticProducts = getProductsByBrand(brand.id);
    const scrapedForBrand = scraped.filter((p) => p.brandId === brand.id);
    const seen = new Set(staticProducts.map((p) => p.name.toLowerCase().trim()));
    const extras = scrapedForBrand.filter((p) => {
      const key = p.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...staticProducts, ...extras];
  }, [brand.id, scraped]);
  const similar = getSimilarBrands(brand);

  const brandLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    url: `https://thedripway.com/brand/${brand.slug}`,
    logo: brand.logo,
    image: brand.banner,
    description: brand.story,
    sameAs: brand.instagram
      ? [`https://instagram.com/${brand.instagram.replace("@", "")}`]
      : undefined,
    aggregateRating: brand.rating
      ? { "@type": "AggregateRating", ratingValue: brand.rating, ratingCount: brand.followers || 1 }
      : undefined,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thedripway.com/" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://thedripway.com/collections" },
      { "@type": "ListItem", position: 3, name: brand.name, item: `https://thedripway.com/brand/${brand.slug}` },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={`${brand.name} — Shop on DRIPWAY`.slice(0, 60)}
        description={(brand.story || `Discover ${brand.name}, ${brand.aesthetics.join(", ")} from ${brand.origin}.`).slice(0, 158)}
        path={`/brand/${brand.slug}`}
        image={typeof brand.banner === "string" ? brand.banner : undefined}
        type="website"
        jsonLd={[brandLd, breadcrumbLd]}
      />
      <div className="container pt-4">
        <Breadcrumbs items={[{ label: "Brands", to: "/brands" }, { label: brand.name }]} />
      </div>
      {/* Hero Banner */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-background">
        {brand.banner && (
          <motion.img
            src={brand.banner}
            alt={`${brand.name} brand banner`}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end">
          <div className="container pb-12 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/brands"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Directory / Brands
              </Link>
            </motion.div>

            <motion.h1
              aria-label={brand.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 select-none break-words font-bold uppercase leading-[0.82] tracking-tighter text-foreground [text-wrap:balance] text-[clamp(3.5rem,14vw,12rem)]"
              style={{ fontFamily: brand.logoFont || undefined }}
            >
              {brand.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <MapPin className="h-3 w-3" /> {brand.origin}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                <Calendar className="h-3 w-3" /> Est. {brand.founded}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                <Star className="h-3 w-3" /> {brand.rating} / 5.0
              </span>
              <div className="mx-2 hidden h-4 w-px bg-white/20 sm:block" />
              <div className="flex flex-wrap gap-2">
                {brand.aesthetics.map(tag => (
                  <span
                    key={tag}
                    className="border border-border/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                <span className="border border-border/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Price {priceTierSymbol(brand.priceRange)}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-border/40 bg-card/20 py-16">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="flex items-center gap-10 md:gap-14">
              <TrackedOutboundLink
                href={`https://instagram.com/${brand.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                trackingProperties={{
                  brand_id: brand.id,
                  brand_name: brand.name,
                  brand_slug: brand.slug,
                  click_type: "instagram",
                  source: "brand_profile_header",
                }}
                className="group flex flex-col text-left transition-colors hover:text-foreground"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">IG Community</span>
                <span className="mt-2 font-display text-4xl font-bold tracking-tighter md:text-5xl">
                  {brand.followers >= 1000 ? `${(brand.followers / 1000).toFixed(1)}K` : brand.followers}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground/80 group-hover:text-accent">
                  <Instagram className="h-3 w-3" /> {brand.instagram}
                </span>
              </TrackedOutboundLink>
              <div className="h-16 w-px bg-border/60" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Drip Rating</span>
                <span className="mt-2 font-display text-4xl font-bold tracking-tighter md:text-5xl">
                  {brand.rating}
                  <span className="text-xl text-muted-foreground/60">/5</span>
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/80">
                  {priceTierLabel(brand.priceRange)} · {priceTierSymbol(brand.priceRange)}
                </span>
              </div>
            </div>
            <TrackedOutboundLink
              href={brand.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              trackingProperties={{
                brand_id: brand.id,
                brand_name: brand.name,
                brand_slug: brand.slug,
                click_type: "shop",
                source: "brand_profile_cta",
              }}
              className="group relative inline-flex items-center justify-center overflow-hidden bg-accent px-14 py-6 text-accent-foreground transition-transform active:scale-95"
            >
              <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.25em]">
                Shop {brand.name}
              </span>
              <ExternalLink className="relative z-10 ml-3 h-4 w-4" />
              <span className="absolute inset-0 z-0 translate-y-full bg-foreground transition-transform duration-300 group-hover:translate-y-0" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.25em] text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Visit Site →
              </span>
            </TrackedOutboundLink>
          </div>
        </div>
      </section>

      {/* Products */}
      {brandProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-baseline justify-between gap-8">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="font-display text-4xl font-bold uppercase italic tracking-tighter md:text-6xl"
              >
                Drop Selects
              </motion.h2>
              <div className="hidden h-px flex-1 bg-border/60 md:block" />
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:block">
                {brandProducts.length} Pieces
              </p>
            </div>
            <div className="masonry-grid mt-10">
              {brandProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram grid */}
      {brand.instagram && brandProducts.length > 0 && (
        <InstagramGrid
          handle={brand.instagram}
          brandName={brand.name}
          brandId={brand.id}
          brandSlug={brand.slug}
          products={brandProducts}
        />
      )}

      {/* Lookbook Gallery */}
      {brand.lookbook && brand.lookbook.length > 0 && (
        <section className="border-t border-border/40 py-20 md:py-28">
          <div className="container">
            <div className="flex items-baseline justify-between gap-8">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="font-display text-4xl font-bold uppercase italic tracking-tighter md:text-6xl"
              >
                Lookbook
              </motion.h2>
              <div className="hidden h-px flex-1 bg-border/60 md:block" />
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:block">
                Campaign Imagery
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {brand.lookbook.map((src, i) => (
                <motion.div
                  key={src}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i % 4}
                  className="group relative overflow-hidden bg-card"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={src}
                    alt={`${brand.name} lookbook ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The Story Section */}
      <section className="border-t border-border/40 py-24 md:py-40">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.4em] text-accent">The Story</p>
              <h2 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.85] tracking-tighter md:text-7xl">
                The<br />Origin
              </h2>
              <div className="mt-8 h-1 w-20 bg-accent" />
            </motion.div>
            <div className="space-y-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
              >
                <div className="relative">
                  <p
                    className={`text-xl font-light leading-relaxed text-foreground/80 md:text-2xl md:leading-[1.5] ${
                      storyExpanded ? "" : "line-clamp-5"
                    }`}
                  >
                    {brand.story}
                  </p>
                  {!storyExpanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                {brand.story && brand.story.length > 280 && (
                  <button
                    type="button"
                    onClick={() => setStoryExpanded(v => !v)}
                    className="mt-6 inline-flex items-center gap-2 border-b border-accent/60 pb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent transition-colors hover:text-foreground"
                    aria-expanded={storyExpanded}
                  >
                    {storyExpanded ? "Collapse" : "Read More"}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${storyExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </motion.div>
              {brand.founderNote && (
                <motion.blockquote
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={2}
                  className="relative border-l border-border/60 py-6 pl-10"
                >
                  <span
                    className="absolute -left-2 -top-6 select-none font-display text-8xl leading-none text-card"
                    aria-hidden
                  >
                    “
                  </span>
                  <p className="font-display text-2xl font-medium italic leading-snug text-foreground md:text-3xl">
                    {brand.founderNote}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-px w-8 bg-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                      Founder — {brand.name}
                    </span>
                  </div>
                </motion.blockquote>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Similar Brands */}
      {similar.length > 0 && (
        <section className="border-t border-border/40 py-20 md:py-28">
          <div className="container">
            <div className="flex items-baseline justify-between gap-8">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="font-display text-3xl font-bold uppercase tracking-tighter md:text-5xl"
              >
                Cross-Pollination
              </motion.h2>
              <div className="hidden h-px flex-1 bg-border/60 md:block" />
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:block">
                Similar Aesthetics
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((b, i) => (
                <BrandCard key={b.id} brand={b} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
