import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { brands, products } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";

const selections = [
  { productId: "p71", heading: "Graphics with Y2K energy", note: "Preview Worldwide’s Racing Team Zip-Up Hoodie brings motorsport graphics to a familiar streetwear shape. A starting point for a louder, graphic-led wardrobe." },
  { productId: "p165", heading: "A heavier everyday layer", note: "Harvx’s Pure Soul Vibe is a full-zip cotton layer with dropped shoulders and a kangaroo pocket. Its catalogue specifies 400 GSM cotton; the garment treatment can produce shade differences." },
  { productId: "p94", heading: "Small details, reflective finish", note: "SABR’s satin reflective skull-caps offer an accessory-led entry into the label. The listed piece pairs satin construction with reflective branding." },
];

export default function BrandEditorialPicks() {
  const { formatPrice } = useCurrency();
  return (
    <section aria-labelledby="editorial-picks" className="mb-12 border-y border-border py-8">
      <p className="text-xs uppercase text-muted-foreground">The discovery edit</p>
      <h2 id="editorial-picks" className="mt-2 font-display text-3xl md:text-4xl">Three ways into underground streetwear</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {selections.map((selection) => {
          const product = products.find((item) => item.id === selection.productId);
          const brand = product && brands.find((item) => item.id === product.brandId);
          if (!product || !brand) return null;
          return (
            <article key={product.id} className="min-w-0">
              <Link to={`/product/${product.id}`} aria-label={product.name}>
                <img src={product.image} alt={product.name} loading="lazy" className="aspect-[4/3] w-full bg-secondary object-contain" />
              </Link>
              <p className="mt-4 text-xs uppercase text-accent">{brand.name}</p>
              <h3 className="mt-2 font-display text-2xl">{selection.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{selection.note}</p>
              <Link to={`/product/${product.id}`} className="mt-4 block text-sm underline underline-offset-4">{product.name} · {formatPrice(product.price, product.prices)}</Link>
              <Button asChild variant="link" className="mt-2 h-auto px-0"><Link to={`/brand/${brand.slug}`}>View {brand.name}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Catalogue price examples, not brand-wide ranges. Confirm current prices, sizing and availability on the brand’s website; purchases are made directly with the brand.</p>
    </section>
  );
}