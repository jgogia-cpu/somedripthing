import { Link } from "react-router-dom";
import type { Brand } from "@/data/brands";

interface BrandCardProps {
  brand: Brand;
  index?: number;
}

export default function BrandCard({ brand, index = 0 }: BrandCardProps) {
  return (
    <div>
      <Link to={`/brand/${brand.slug}`} className="group block">
        <div className={`relative overflow-hidden rounded-md border border-border flex items-center justify-center transition-colors duration-200 group-hover:border-foreground/40 ${brand.lightCard ? "bg-white" : brand.darkCard ? "bg-black" : "bg-secondary"}`} style={{ aspectRatio: "3/2" }}>
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${brand.fullBleedLogo ? "object-cover" : "object-contain p-8"}`}
          />
        </div>
        <div className="mt-2.5">
          <h3 className="truncate text-sm font-semibold text-foreground" style={{ fontFamily: brand.logoFont || undefined }}>
            {brand.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {brand.aesthetics.slice(0, 2).map(tag => (
              <span key={tag} className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
