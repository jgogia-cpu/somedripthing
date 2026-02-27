import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { brands, products, blogPosts, AESTHETICS } from "@/data/brands";

export default function Index() {
  const featuredBrand = brands.find(b => b.featured)!;
  const trendingProducts = products.filter(p => p.trending).slice(0, 8);
  const newDropBrands = brands.filter(b => b.newDrop);
  const featuredBrands = brands.filter(b => b.featured).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3 w-3" /> Now featuring {brands.length}+ brands
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
              Discover the brands
              <br />
              <span className="text-accent">Instagram won't</span>
              <br />
              show you
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Your curated discovery engine for underground, emerging, and niche fashion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/explore">
                <Button size="lg" className="gap-2 rounded-full">
                  Explore Brands <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={`/brand/${featuredBrand.slug}`}>
                <Button size="lg" variant="outline" className="rounded-full">
                  Today's Spotlight: {featuredBrand.name}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Decorative bg */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-drip-sage/10 blur-3xl" />
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

      {/* Editorial Preview */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">From the Editorial</h2>
            <Link to="/blog" className="text-sm font-medium text-accent hover:underline">
              Read all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                      {post.category}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-semibold leading-tight">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{post.readTime} min read</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
