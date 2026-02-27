import { useParams, Link } from "react-router-dom";
import { ExternalLink, Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getProductById, getBrandById, getRelatedProducts } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { formatPrice } = useCurrency();

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg">Product not found.</p>
        <Link to="/explore" className="mt-4 text-sm text-accent hover:underline">← Back to Explore</Link>
      </div>
    );
  }

  const brand = getBrandById(product.brandId);
  const related = getRelatedProducts(product);

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <Link to="/explore" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to Explore
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="overflow-hidden rounded-xl bg-secondary">
              <img src={product.image} alt={product.name} className="w-full object-cover" style={{ aspectRatio: "3/4" }} />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg bg-secondary">
                    <img src={img} alt="" className="aspect-square w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {brand && (
              <Link to={`/brand/${brand.slug}`} className="text-sm font-medium uppercase tracking-wider text-accent hover:underline">
                {brand.name}
              </Link>
            )}
            <h1 className="font-display text-3xl font-bold md:text-4xl">{product.name}</h1>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Sizes */}
            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:border-accent">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.aesthetics.map(a => (
                <Link key={a} to={`/explore?aesthetic=${a}`}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  {a}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-2">
              <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2 rounded-full" size="lg">
                  Buy from {product.brandName} <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <Button variant="outline" size="lg" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-bold">You might also like</h2>
            <div className="masonry-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
