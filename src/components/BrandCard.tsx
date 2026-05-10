import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Brand } from "@/data/brands";

interface BrandCardProps {
  brand: Brand;
  index?: number;
}

export default function BrandCard({ brand, index = 0 }: BrandCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/brand/${brand.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-md flex items-center justify-center ring-1 ring-border/50 transition-all duration-500 group-hover:ring-foreground/30 ${brand.lightCard ? "bg-white" : brand.darkCard ? "bg-black" : "bg-secondary"}`} style={{ aspectRatio: "3/2" }}>
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${brand.fullBleedLogo ? "object-cover" : "object-contain p-8"}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${brand.lightCard ? "from-white via-white/40" : "from-black/80 via-black/30"} to-transparent`} />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className={`block text-[9px] font-semibold uppercase tracking-[0.28em] ${brand.lightCard ? "text-black/60" : "text-white/60"}`}>The House of</span>
            <h3
              className={`mt-1 text-xl font-semibold ${brand.lightCard ? "text-black" : "text-white"}`}
              style={{ fontFamily: brand.logoFont || undefined, letterSpacing: brand.logoFont ? "0.05em" : "0.01em" }}
            >
              {brand.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {brand.aesthetics.slice(0, 2).map(tag => (
                <span key={tag} className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm ${brand.lightCard ? "border-black/20 bg-black/5 text-black/80" : "border-white/20 bg-white/10 text-white/90"}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
