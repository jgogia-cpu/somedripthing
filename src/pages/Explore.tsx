import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import { brands, products, AESTHETICS, CATEGORIES } from "@/data/brands";

// Cache shuffled product IDs per-tab so order persists across navigation within
// a single session but reshuffles on a fresh visit.
function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sessionOrder(key: string, ids: string[]): string[] {
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed: string[] = JSON.parse(cached);
      const set = new Set(ids);
      const kept = parsed.filter((id) => set.has(id));
      const added = ids.filter((id) => !parsed.includes(id));
      const next = [...kept, ...shuffleArr(added)];
      if (added.length === 0 && kept.length === parsed.length) return next;
      sessionStorage.setItem(key, JSON.stringify(next));
      return next;
    }
  } catch { /* ignore */ }
  const shuffled = shuffleArr(ids);
  try { sessionStorage.setItem(key, JSON.stringify(shuffled)); } catch { /* ignore */ }
  return shuffled;
}
function applySessionOrder<T extends { id: string }>(key: string, items: T[]): T[] {
  const order = sessionOrder(key, items.map((i) => i.id));
  const map = new Map(items.map((i) => [i.id, i] as const));
  return order.map((id) => map.get(id)!).filter(Boolean);
}

const PRICE_RANGES = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100–$300", min: 100, max: 300 },
  { label: "$300–$600", min: 300, max: 600 },
  { label: "$600+", min: 600, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [view, setView] = useState<"products" | "brands">(
    (searchParams.get("view") as any) || "products"
  );
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>(
    searchParams.get("aesthetic") ? [searchParams.get("aesthetic")!] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [sort, setSort] = useState(searchParams.get("sort") || "trending");
  const [showFilters, setShowFilters] = useState(false);

  const toggleAesthetic = (a: string) =>
    setSelectedAesthetics(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const toggleCategory = (c: string) =>
    setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const activeFilterCount = selectedAesthetics.length + selectedCategories.length + (selectedPrice !== null ? 1 : 0);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brandName.toLowerCase().includes(search.toLowerCase()));
    if (selectedAesthetics.length) result = result.filter(p => p.aesthetics.some(a => selectedAesthetics.includes(a)));
    if (selectedCategories.length) result = result.filter(p => selectedCategories.includes(p.category));
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sort === "newest") {
      const newOnes = applySessionOrder("dw:explore:newest:new", result.filter(p => p.newArrival));
      const rest = applySessionOrder("dw:explore:newest:rest", result.filter(p => !p.newArrival));
      result = [...newOnes, ...rest];
    } else {
      // Trending (default): shuffle trending first, then the rest — fresh order each visit.
      const trend = applySessionOrder("dw:explore:trending:trend", result.filter(p => p.trending));
      const rest = applySessionOrder("dw:explore:trending:rest", result.filter(p => !p.trending));
      result = [...trend, ...rest];
    }
    // Pin Preview Worldwide Multicolor products to top
    const pinnedIds = ["p92", "p93", "p69", "p70"];
    result.sort((a, b) => {
      const aPin = pinnedIds.indexOf(a.id);
      const bPin = pinnedIds.indexOf(b.id);
      if (aPin !== -1 && bPin !== -1) return aPin - bPin;
      if (aPin !== -1) return -1;
      if (bPin !== -1) return 1;
      return 0;
    });
    return result;
    // SESSION_SEED is included so the memo reflects the per-load shuffle.
  }, [search, selectedAesthetics, selectedCategories, selectedPrice, sort]);

  const filteredBrands = useMemo(() => {
    let result = [...brands];
    if (search) result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedAesthetics.length) result = result.filter(b => b.aesthetics.some(a => selectedAesthetics.includes(a)));
    return result;
  }, [search, selectedAesthetics]);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Explore</h1>
          <p className="mt-1 text-muted-foreground">Discover {brands.length} brands and {products.length}+ products</p>
        </div>

        {/* Search + Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search brands, products, aesthetics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            <div className="flex rounded-lg border">
              <button
                onClick={() => setView("products")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "products" ? "bg-primary text-primary-foreground" : ""}`}
              >
                Products
              </button>
              <button
                onClick={() => setView("brands")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "brands" ? "bg-primary text-primary-foreground" : ""}`}
              >
                Brands
              </button>
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-xs"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden rounded-xl border bg-card p-6"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Aesthetic</h3>
                  <div className="flex flex-wrap gap-2">
                    {AESTHETICS.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAesthetic(a)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          selectedAesthetics.includes(a)
                            ? "border-accent bg-accent text-accent-foreground"
                            : "hover:border-accent"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                {view === "products" && (
                  <>
                    <div>
                      <h3 className="mb-3 text-sm font-semibold">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => (
                          <button
                            key={c}
                            onClick={() => toggleCategory(c)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              selectedCategories.includes(c)
                                ? "border-accent bg-accent text-accent-foreground"
                                : "hover:border-accent"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
                      <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedPrice(selectedPrice === i ? null : i)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              selectedPrice === i
                                ? "border-accent bg-accent text-accent-foreground"
                                : "hover:border-accent"
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedAesthetics([]); setSelectedCategories([]); setSelectedPrice(null); }}
                    className="gap-1 text-xs"
                  >
                    <X className="h-3 w-3" /> Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {view === "products" ? (
          <div className="masonry-grid">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBrands.map((brand, i) => (
              <BrandCard key={brand.id} brand={brand} index={i} />
            ))}
          </div>
        )}

        {(view === "products" ? filteredProducts : filteredBrands).length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
