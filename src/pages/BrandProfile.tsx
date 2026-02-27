import { useParams, Link } from "react-router-dom";
import { ExternalLink, Instagram, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { getBrandBySlug, getProductsByBrand, getSimilarBrands } from "@/data/brands";

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
      {/* Banner */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <img src={brand.banner} alt={brand.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{brand.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {brand.aesthetics.map(tag => (
                <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Info */}
        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-muted-foreground">{brand.bio}</p>
            <p className="mt-3 text-sm text-muted-foreground">📍 {brand.origin}</p>
          </div>
          <div className="space-y-4">
            <a href={brand.affiliateUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2 rounded-full" size="lg">
                Shop {brand.name} <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <div className="flex gap-3">
              <a href={`https://instagram.com/${brand.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Instagram className="h-4 w-4" /> {brand.instagram}
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{(brand.followers / 1000).toFixed(0)}K followers</span>
              <span>★ {brand.rating}</span>
              <span className="capitalize">{brand.priceRange} range</span>
            </div>
          </div>
        </div>

        {/* Products */}
        {brandProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 font-display text-2xl font-bold">Products</h2>
            <div className="masonry-grid">
              {brandProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Similar Brands */}
        {similar.length > 0 && (
          <section>
            <h2 className="mb-6 font-display text-2xl font-bold">Similar Brands</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((b, i) => (
                <BrandCard key={b.id} brand={b} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
