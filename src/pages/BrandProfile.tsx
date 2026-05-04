import { useParams, Link } from "react-router-dom";
import { ExternalLink, Instagram, ArrowLeft, MapPin, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { getBrandBySlug, getProductsByBrand, getSimilarBrands } from "@/data/brands";
import InstagramCTA from "@/components/InstagramCTA";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

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
        <Link to="/explore" className="mt-4 text-sm text-accent hover:underline">← Back to Explore</Link>
      </div>
    );
  }

  const brandProducts = getProductsByBrand(brand.id);
  const similar = getSimilarBrands(brand);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className={`relative h-[70vh] min-h-[500px] overflow-hidden ${brand.banner === brand.logo ? (brand.lightCard ? "bg-white" : "bg-black") : ""}`}>
        <img
          src={brand.banner}
          alt={brand.name}
          className={`h-full w-full ${brand.banner === brand.logo ? "object-contain p-12 md:p-24" : "object-cover"}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${brand.banner === brand.logo && brand.lightCard ? "from-white via-white/30" : "from-black via-black/40"} to-transparent`} />
        {(() => null)()}
        <div className={`absolute bottom-0 left-0 right-0 ${brand.banner === brand.logo && brand.lightCard ? "[&_*]:!text-black [&_.bg-white\\/15]:!bg-black/10" : ""}`}>
          <div className="container pb-12">
            <Link to="/explore" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Explore
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-5xl font-bold text-white md:text-7xl"
              style={{ fontFamily: brand.logoFont || undefined }}
            >
              {brand.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-3.5 w-3.5" /> {brand.origin}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Calendar className="h-3.5 w-3.5" /> Est. {brand.founded}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Star className="h-3.5 w-3.5" /> {brand.rating}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-sm capitalize text-white/70">{brand.priceRange} range</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {brand.aesthetics.map(tag => (
                <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
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
