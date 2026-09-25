import { Link } from "react-router-dom";
import type { Brand } from "@/data/brands";
import { isRecent } from "@/lib/isRecent";

interface BrandCardProps {
  brand: Brand;
  index?: number;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <div className="content-auto">
      <Link to={`/brand/${brand.slug}`} className="group block">
        <div className={`relative flex items-center justify-center overflow-hidden border border-border/60 transition-colors duration-300 group-hover:border-accent/70 ${brand.lightCard ? "bg-primary" : brand.darkCard ? "bg-accent-foreground" : "bg-secondary/60"}`} style={{ aspectRatio: "16/10" }}>
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${brand.fullBleedLogo ? "object-cover" : "object-contain p-8"}`}
          />
          {!brand.fullBleedLogo && (
            <div className={`absolute inset-0 bg-gradient-to-t ${brand.lightCard ? "from-primary via-primary/40" : "from-accent-foreground/70 via-accent-foreground/20"} to-transparent`} />
          )}
          {isRecent(brand.addedAt) && (
              <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-accent-foreground shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground/80" />
              New
            </span>
          )}
          {/* Editorial hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              {brand.aesthetics.slice(0, 3).join(" · ")}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground/80">
              View brand →
            </p>
          </div>
          <div className="absolute bottom-0 left-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
            <h3
              className={`relative inline-block text-lg font-bold ${
                brand.nameGlow
                   ? "rounded-full bg-accent/15 ring-1 ring-accent/30 px-3 py-1"
                   : "drop-shadow-lg"
              } ${
                brand.nameColor === "accent"
                  ? "text-accent"
                  : brand.nameColor === "white"
                  ? "text-primary"
                  : brand.nameColor === "black"
                  ? "text-accent-foreground"
                  : brand.lightCard
                  ? "text-accent-foreground"
                  : "text-primary"
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
                    ? "bg-accent-foreground/15 text-accent-foreground"
                    : brand.tagColor === "light"
                    ? "bg-primary/20 text-primary"
                    : brand.lightCard
                    ? "bg-accent-foreground/10 text-accent-foreground"
                    : "bg-primary/20 text-primary";
                return (
                  <span key={tag} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tagClass}`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
