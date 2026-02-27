import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { brands, products, blogPosts, AESTHETICS, getBrandById } from "@/data/brands";

const heroProducts = products.filter(p => p.trending).slice(0, 5);

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trendingProducts = products.filter(p => p.trending).slice(0, 8);
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
      {/* Hero Carousel */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden bg-primary">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="container relative z-10 flex h-full items-end pb-16 md:items-center md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-lg"
            >
              {brand && (
                <Link
                  to={`/brand/${brand.slug}`}
                  className="mb-3 inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
                >
                  {brand.name}
                </Link>
              )}
              <h1 className="font-display text-4xl font-bold leading-[1.1] text-white md:text-6xl">
                {current.name}
              </h1>
              <p className="mt-3 text-lg text-white/70">${current.price}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {current.aesthetics.map(a => (
                  <span key={a} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link to={`/product/${current.id}`}>
                  <Button size="lg" className="gap-2 rounded-full bg-white text-black hover:bg-white/90">
                    View Product <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                    Explore All
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Arrows */}
        <div className="absolute bottom-8 right-8 z-10 flex items-center gap-3 md:bottom-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:flex-col">
          <button onClick={prevSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextSlide} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
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
