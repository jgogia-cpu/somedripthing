import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, getBrandById, Product } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

const dripByRageProducts = products.filter(p => p.brandId === "17").slice(0, 6);
const brand = getBrandById("17")!;

function FeaturedProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  const allImages = product.images?.length > 0 ? product.images : [product.image];
  const hasMultiple = allImages.length > 1;
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-black/90 shadow-lg transition-shadow hover:shadow-xl">
        <div className="relative">
          <img
            src={allImages[imgIndex]}
            alt={product.name}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ aspectRatio: "3/4", height: "360px" }}
          />
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex - 1 + allImages.length) % allImages.length); }}
              >
                <ChevronLeft className="h-3.5 w-3.5 text-white" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 backdrop-blur-md opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/80"
                onClick={(e) => { e.preventDefault(); setImgIndex((imgIndex + 1) % allImages.length); }}
              >
                <ChevronRight className="h-3.5 w-3.5 text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {allImages.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "w-4 bg-accent" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
          {product.newArrival && (
            <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-0.5 text-xs font-bold text-white">
              New
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            {product.brandName}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">{product.name}</p>
          <p className="mt-0.5 text-sm font-bold text-white">{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBrandSection() {
  return (
    <section className="py-16" style={{ backgroundColor: "hsl(16, 85%, 60%)" }}>
      <div className="container">
        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border-2 border-black/20 bg-black/90 px-6 py-4 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">Exclusive Offer</p>
          <p className="mt-1 text-2xl font-black uppercase tracking-wide text-white md:text-3xl" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            USE CODE <span style={{ color: "hsl(16, 85%, 60%)" }}>DRIPWAYAPPAREL</span> FOR 10% OFF
          </p>
          <p className="mt-1 text-sm text-white/60">
            at <a href="https://dripbyrage.com/dripwayapparel" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">DRIPBYRAGE.COM</a>
          </p>
        </motion.div>

        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-black/50">Today's Featured Brand</p>
            <h2
              className="text-3xl font-black uppercase text-black md:text-4xl"
              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
            >
              {brand.name}
            </h2>
          </div>
          <Link to={`/brand/${brand.slug}`}>
            <Button className="gap-2 rounded-full bg-black text-white hover:bg-black/80">
              View Brand <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dripByRageProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <FeaturedProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
