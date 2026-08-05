import { useMemo, useState } from "react";
import BrandCard from "@/components/BrandCard";
import SEO from "@/components/SEO";
import { brands, AESTHETICS } from "@/data/brands";

export default function Brands() {
  const [active, setActive] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filtered = useMemo(
    () => (active ? sorted.filter(b => b.aesthetics.includes(active)) : sorted),
    [sorted, active]
  );

  return (
    <div className="dw-wallpaper min-h-screen">
      <SEO
        title="Brands — DRIPWAY"
        description="Browse every niche fashion brand on DRIPWAY. Discover emerging streetwear, designer and underground labels in one place."
        path="/brands"
        type="website"
      />
      <section className="container py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Directory</p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-5xl">Brands</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every label on DRIPWAY — curated, niche, and worth your attention.
          </p>
        </div>

        {/* Aesthetic pill filters */}
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActive(null)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all min-h-[44px] ${
              active === null
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border/60 text-muted-foreground hover:border-accent/60 hover:text-foreground"
            }`}
          >
            All <span className="ml-1 opacity-60">{sorted.length}</span>
          </button>
          {AESTHETICS.map(tag => {
            const isActive = active === tag;
            return (
              <button
                key={tag}
                onClick={() => setActive(isActive ? null : tag)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all min-h-[44px] ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border/60 text-muted-foreground hover:border-accent/60 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/40 bg-secondary/20 p-12 text-center">
            <p className="text-sm text-muted-foreground">Nothing here yet — we're always adding.</p>
            <button
              onClick={() => setActive(null)}
              className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((brand, i) => {
              // Editorial rhythm: every 5th card spans 2 columns on desktop
              const featured = i % 5 === 0;
              return (
                <div
                  key={brand.id}
                  className={featured ? "lg:col-span-2" : "lg:col-span-1"}
                >
                  <BrandCard brand={brand} index={i} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}