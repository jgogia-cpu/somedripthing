import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import BrandCard from "@/components/BrandCard";
import SEO from "@/components/SEO";
import { brands, AESTHETICS } from "@/data/brands";
import BrandEditorialPicks from "@/components/BrandEditorialPicks";

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
    <div className="min-h-screen bg-background dw-wallpaper">
      <SEO
        title="Underground Streetwear Brands & Independent Labels — DRIPWAY"
        description="Discover underground streetwear brands and independent fashion labels. Explore Y2K graphics, grunge and minimal styles, with selected pieces and catalogue prices."
        path="/brands"
        type="website"
      />
      <section className="container py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Directory</p>
          <h1 className="mt-1 font-display text-3xl md:text-5xl">Underground streetwear brands</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Independent labels, from graphic-heavy Y2K streetwear to grunge, archive-inspired and minimal pieces. Explore the edit, then browse every brand by aesthetic.
          </p>
        </div>

        <BrandEditorialPicks />
        <h2 className="mb-4 font-display text-2xl">All independent labels</h2>

        {/* Aesthetic pill filters */}
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActive(null)}
            className={`shrink-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all min-h-[44px] ${
              active === null
                ? "border-foreground bg-foreground text-background"
                : "border-border/60 text-muted-foreground hover:border-foreground/60 hover:text-foreground"
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
                className={`shrink-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all min-h-[44px] ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border/60 text-muted-foreground hover:border-foreground/60 hover:text-foreground"
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
          <ol className="border-t border-border">
            {filtered.map((brand, i) => (
              <li key={brand.id} className="border-b border-border">
                <Link to={`/brand/${brand.slug}`} className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[4rem_1fr_auto] md:py-6">
                  <span className="text-xs tracking-[0.2em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-3xl leading-none text-foreground/70 transition-colors duration-300 group-hover:text-foreground md:text-6xl">{brand.name}</span>
                  <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">{brand.tags?.slice(0, 2).join(" / ")}</span>
                  <img src={brand.lookbook?.[0] || brand.banner || brand.logo} alt="" loading="lazy" className="pointer-events-none absolute right-40 top-1/2 z-10 hidden aspect-[3/4] w-48 -translate-y-1/2 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}