import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Brand } from "@/data/brands";
import { isRecent } from "@/lib/isRecent";

interface BrandCardProps {
  brand: Brand;
  index?: number;
}

export default function BrandCard({ brand, index = 0 }: BrandCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.03, duration: 0.3 }}
    >
      <Link to={`/brand/${brand.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-2xl glass-card flex items-center justify-center transition-shadow duration-500 group-hover:shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.35)] ${brand.lightCard ? "bg-white" : brand.darkCard ? "bg-black" : "bg-secondary/60"}`} style={{ aspectRatio: "3/2" }}>
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-700 ease-out ${brand.fullBleedLogo ? "object-cover" : "object-contain p-8"}`}
          />
          {!brand.fullBleedLogo && (
            <div className={`absolute inset-0 bg-gradient-to-t ${brand.lightCard ? "from-white via-white/40" : "from-black/70 via-black/20"} to-transparent`} />
          )}
          {isRecent(brand.addedAt) && (
            <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-accent-foreground shadow-lg backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground/80" />
              New
            </span>
          )}
          {/* Editorial hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              {brand.aesthetics.slice(0, 3).join(" · ")}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/80">
              View brand →
            </p>
          </div>
          <div className="absolute bottom-0 left-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
            <h3
              className={`relative inline-block text-lg font-bold ${
                brand.nameGlow
                  ? "rounded-full bg-accent/15 ring-1 ring-accent/30 backdrop-blur-sm px-3 py-1"
                  : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              } ${
                brand.nameColor === "accent"
                  ? "text-accent"
                  : brand.nameColor === "white"
                  ? "text-white"
                  : brand.nameColor === "black"
                  ? "text-black"
                  : brand.lightCard
                  ? "text-black"
                  : "text-white"
              }`}
              style={{
                fontFamily: brand.logoFont || undefined,
                letterSpacing: brand.logoFont ? "0.05em" : undefined,
              }}
            >
              {brand.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {brand.aesthetics.slice(0, 2).map(tag => {
                const tagClass =
                  brand.tagColor === "accent"
                    ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                    : brand.tagColor === "dark"
                    ? "bg-black/15 text-black"
                    : brand.tagColor === "light"
                    ? "bg-white/20 text-white"
                    : brand.lightCard
                    ? "bg-black/10 text-black"
                    : "bg-white/20 text-white";
                return (
                  <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${tagClass}`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
