import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandCard from "@/components/BrandCard";
import SEO from "@/components/SEO";
import { brands, products, AESTHETICS } from "@/data/brands";
import BrandEditorialPicks from "@/components/BrandEditorialPicks";
import { useScrapedProducts } from "@/hooks/useScrapedProducts";

export default function Brands() {
  const [active, setActive] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // Which row the pointer is over, and whether the page is mid-scroll.
  const pointerId = useRef<string | null>(null);
  const scrolling = useRef(false);
  const scrollIdle = useRef<number | undefined>(undefined);

  // Opening or closing a row pushes every row below it up or down, which fights
  // a scroll gesture. So while the page is moving the open row holds still; the
  // hover only catches up when the pointer itself moves, or once a scroll ends
  // with the pointer off the list entirely.
  useEffect(() => {
    const markScroll = () => {
      scrolling.current = true;
      window.clearTimeout(scrollIdle.current);
      scrollIdle.current = window.setTimeout(() => {
        scrolling.current = false;
        if (pointerId.current === null) setOpenId(null);
      }, 180);
    };
    const onMove = () => {
      if (!scrolling.current && pointerId.current) setOpenId(pointerId.current);
    };
    const opts = { passive: true, capture: true } as const;
    window.addEventListener("wheel", markScroll, opts);
    window.addEventListener("touchmove", markScroll, opts);
    window.addEventListener("scroll", markScroll, opts);
    window.addEventListener("pointermove", onMove, opts);
    return () => {
      window.removeEventListener("wheel", markScroll, opts);
      window.removeEventListener("touchmove", markScroll, opts);
      window.removeEventListener("scroll", markScroll, opts);
      window.removeEventListener("pointermove", onMove, opts);
      window.clearTimeout(scrollIdle.current);
    };
  }, []);

  const enterRow = (id: string) => {
    pointerId.current = id;
    if (!scrolling.current) setOpenId(id);
  };

  // A row scrolling out from under the pointer also fires pointerleave, so
  // leaving a row only tracks the pointer — the list itself closes the panel.
  const leaveRow = (id: string) => {
    if (pointerId.current === id) pointerId.current = null;
  };

  const leaveList = () => {
    pointerId.current = null;
    if (!scrolling.current) setOpenId(null);
  };

  const pick = (tag: string | null) => {
    setActive(tag);
    pointerId.current = null;
    setOpenId(null);
  };

  const scraped = useScrapedProducts();
  const productsByBrand = useMemo(() => {
    const map = new Map<string, typeof products>();
    for (const p of [...products, ...scraped]) {
      if (!p.image) continue;
      const list = map.get(p.brandId) ?? [];
      if (list.length < 6) list.push(p);
      map.set(p.brandId, list);
    }
    return map;
  }, [scraped]);

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
            onClick={() => pick(null)}
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
                onClick={() => pick(isActive ? null : tag)}
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
              onClick={() => pick(null)}
              className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ol className="border-t border-border" onPointerLeave={leaveList}>
            {filtered.map((brand, i) => {
              const isOpen = openId === brand.id;
              return (
                <li key={brand.id} className="border-b border-border">
                  <Link
                    to={`/brand/${brand.slug}`}
                    className="group block py-5 md:py-6"
                    onPointerEnter={() => enterRow(brand.id)}
                    onPointerLeave={() => leaveRow(brand.id)}
                  >
                    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 md:grid-cols-[4rem_1fr_auto]">
                      <span className="text-xs tracking-[0.2em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-3xl font-bold leading-none text-foreground/70 transition-colors duration-300 group-hover:text-foreground md:text-6xl" style={{ fontFamily: brand.logoFont || "Anton, sans-serif" }}>{brand.name}</span>
                      <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">{brand.aesthetics.slice(0, 2).join(" / ")}</span>
                    </div>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out group-focus-visible:grid-rows-[1fr] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className="flex gap-3 overflow-x-auto pt-5 md:pl-[5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {(productsByBrand.get(brand.id) ?? []).map((p) => (
                            <div key={p.id} className="w-28 shrink-0 md:w-36">
                              <div className="aspect-[3/4] overflow-hidden bg-card"><img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" /></div>
                              <p className="mt-2 truncate text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{p.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
