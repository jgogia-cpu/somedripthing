import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, getBrandById } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

const dripByRageProducts = products.filter(p => p.brandId === "17").slice(0, 6);
const brand = getBrandById("17")!;

export default function FeaturedBrandSection() {
  const { formatPrice } = useCurrency();

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
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                      {product.brandName}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-white">{product.name}</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
