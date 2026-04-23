import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, Heart, ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getProductById, getBrandById, getRelatedProducts } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

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
  const wishlisted = isInWishlist(product.id);

  const getStockStatus = (size: string) => {
    if (!product.sizeStock) return true; // assume in stock if no data
    return product.sizeStock[size] !== false;
  };

  const handleWishlist = () => {
    if (user) toggleWishlist(product.id);
  };

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
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full object-cover"
                style={{ aspectRatio: "3/4" }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`overflow-hidden rounded-lg bg-secondary ring-2 transition-all ${selectedImage === i ? "ring-accent" : "ring-transparent"}`}
                  >
                    <img src={img} alt="" className="aspect-square w-full object-cover" />
                  </button>
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

            {/* Sizes with stock */}
            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const inStock = getStockStatus(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!inStock}
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      className={`relative rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-accent bg-accent text-accent-foreground"
                          : inStock
                          ? "hover:border-accent"
                          : "cursor-not-allowed border-muted text-muted-foreground/40 line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <p className="mt-2 flex items-center gap-1 text-xs">
                  {getStockStatus(selectedSize) ? (
                    <>
                      <Check className="h-3 w-3 text-accent" />
                      <span className="text-accent">In stock at {product.brandName}</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">Out of stock</span>
                    </>
                  )}
                </p>
              )}
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
              <TrackedOutboundLink
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                trackingProperties={{
                  brand_id: product.brandId,
                  brand_name: product.brandName,
                  brand_slug: brand?.slug,
                  click_type: "product",
                  product_id: product.id,
                  product_name: product.name,
                  source: "product_detail_cta",
                }}
              >
                <Button className="w-full gap-2 rounded-full" size="lg">
                  Buy from {product.brandName} <ExternalLink className="h-4 w-4" />
                </Button>
              </TrackedOutboundLink>
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full ${wishlisted ? "border-accent text-accent" : ""}`}
                onClick={handleWishlist}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground">Sign in to save to your wishlist</p>
            )}
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
