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
        <div className="relative overflow-hidden rounded-xl bg-secondary flex items-center justify-center" style={{ aspectRatio: "3/2" }}>
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h3
              className="text-lg font-bold text-white"
              style={{ fontFamily: brand.logoFont || undefined, letterSpacing: brand.logoFont ? "0.05em" : undefined }}
            >
              {brand.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {brand.aesthetics.slice(0, 2).map(tag => (
                <span key={tag} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
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
