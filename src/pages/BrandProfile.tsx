import { useParams, Link } from "react-router-dom";
import { ExternalLink, Instagram, ArrowLeft, MapPin, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { getBrandBySlug, getProductsByBrand, getSimilarBrands } from "@/data/brands";
import InstagramCTA from "@/components/InstagramCTA";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import SEO from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

export default function BrandProfile() {
  const { slug } = useParams<{ slug: string }>();
  const brand = getBrandBySlug(slug || "");

  if (!brand) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg">Brand not found.</p>
        <Link to="/collections" className="mt-4 text-sm text-accent hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const brandProducts = getProductsByBrand(brand.id);
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
      {/* Hero Banner */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-background via-secondary/40 to-background">
        {/* Ambient glow orbs for liquid-glass mood */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[140px]" />
        {/* Typographic brand name as hero */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1
            aria-label={brand.name}
            className="select-none text-center font-bold leading-none tracking-tight text-foreground/90 [text-wrap:balance] text-[clamp(4rem,18vw,18rem)]"
            style={{ fontFamily: brand.logoFont || undefined, letterSpacing: brand.logoFont ? "0.02em" : undefined }}
          >
            {brand.name}
          </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-12">
            <Link to="/collections" className="mb-6 inline-flex items-center gap-1.5 rounded-full glass-pill px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="flex items-center gap-1.5 rounded-full glass-pill px-3 py-1.5 text-sm text-foreground/80">
                <MapPin className="h-3.5 w-3.5" /> {brand.origin}
              </span>
              <span className="flex items-center gap-1.5 rounded-full glass-pill px-3 py-1.5 text-sm text-foreground/80">
                <Calendar className="h-3.5 w-3.5" /> Est. {brand.founded}
              </span>
              <span className="flex items-center gap-1.5 rounded-full glass-pill px-3 py-1.5 text-sm text-foreground/80">
                <Star className="h-3.5 w-3.5" /> {brand.rating}
              </span>
              <span className="rounded-full glass-pill px-3 py-1.5 text-sm capitalize text-foreground/80">{brand.priceRange} range</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {brand.aesthetics.map(tag => (
                <span key={tag} className="glass-pill rounded-full px-3 py-1 text-xs font-medium text-foreground/90">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* The Story Section */}
      <section className="border-b border-border/40 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent"
            >
              The Story
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="mt-6 text-xl leading-relaxed text-foreground/80 md:text-2xl md:leading-relaxed"
            >
              {brand.story}
            </motion.p>
            {brand.founderNote && (
              <motion.blockquote
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
                className="mt-10 border-l-2 border-accent pl-6"
              >
                <p className="text-lg italic text-muted-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {brand.founderNote}
                </p>
              </motion.blockquote>
            )}
          </div>
        </div>
      </section>

      {/* The Vibe Section */}
      <section className="border-b border-border/40 py-16 md:py-20">
        <div className="container">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-accent"
          >
            The Vibe
          </motion.p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brand.vibes.map((vibe, i) => (
              <motion.div
                key={vibe}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-foreground">{vibe}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-border/40 py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-6">
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
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Instagram className="h-5 w-5" /> {brand.instagram}
              </TrackedOutboundLink>
              <span className="text-sm text-muted-foreground">
                {(brand.followers / 1000).toFixed(0)}K followers
              </span>
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
            >
              <Button className="gap-2 rounded-full px-8" size="lg">
                Shop {brand.name} <ExternalLink className="h-4 w-4" />
              </Button>
            </TrackedOutboundLink>
          </div>
        </div>
      </section>

      {/* Products */}
      {brandProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-accent"
            >
              The Collection
            </motion.p>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="mt-4 text-center font-display text-3xl font-bold md:text-4xl"
            >
              Shop {brand.name}
            </motion.h2>
            <div className="masonry-grid mt-10">
              {brandProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram CTA */}
      <InstagramCTA
        handle={brand.instagram}
        followers={brand.followers}
        label="Follow The Brand"
        heading={`@${brand.instagram.replace("@", "")}`}
        trackingProperties={{
          brand_id: brand.id,
          brand_name: brand.name,
          brand_slug: brand.slug,
          click_type: "instagram",
          source: "brand_profile_instagram_cta",
        }}
      />

      {/* Similar Brands */}
      {similar.length > 0 && (
        <section className="border-t border-border/40 py-16 md:py-24">
          <div className="container">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-accent"
            >
              Discover More
            </motion.p>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="mt-4 text-center font-display text-3xl font-bold"
            >
              Similar Brands
            </motion.h2>
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
