import BrandCard from "@/components/BrandCard";
import SEO from "@/components/SEO";
import { brands } from "@/data/brands";

export default function Brands() {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="min-h-screen">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((brand, i) => (
            <BrandCard key={brand.id} brand={brand} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}