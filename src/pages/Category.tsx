import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/brands";

const SUBCATEGORY_LABELS: Record<string, string> = {
  hoodies: "Hoodies",
  shirts: "Shirts",
  sweaters: "Sweaters",
  denim: "Denim",
  bottoms: "Bottoms",
  jackets: "Jackets",
  kicks: "Kicks",
  accessories: "Accessories",
};

// Per-subcategory matchers. Use both category and name-keyword heuristics so
// each section only shows products that actually fit (e.g. Denim must be jeans).
const MATCHERS: Record<string, (p: Product) => boolean> = {
  hoodies: (p) => {
    const n = p.name.toLowerCase();
    return p.category === "Tops" && (/(hoodie|zip[- ]?up|hooded)/.test(n));
  },
  shirts: (p) => {
    const n = p.name.toLowerCase();
    if (p.category !== "Tops") return false;
    if (/(hoodie|zip[- ]?up|hooded|sweater|sweatshirt|crewneck|knit|cardigan)/.test(n)) return false;
    return /(shirt|tee|t-shirt|polo|jersey|top|blouse|button|long sleeve|longsleeve|long-sleeve|tank)/.test(n) || true;
  },
  sweaters: (p) => {
    const n = p.name.toLowerCase();
    if (p.category === "Knitwear") return true;
    return p.category === "Tops" && /(sweater|sweatshirt|crewneck|knit|cardigan|jumper|pullover)/.test(n) && !/(hoodie|zip[- ]?up)/.test(n);
  },
  denim: (p) => {
    const n = p.name.toLowerCase();
    return p.category === "Bottoms" && /(denim|jean|jeans)/.test(n);
  },
  bottoms: (p) => {
    const n = p.name.toLowerCase();
    if (p.category !== "Bottoms") return false;
    // exclude pure denim so it lives in the Denim section
    return !/(denim|jean|jeans)/.test(n) || /(pant|trouser|jogger|short|cargo|sweatpant|baggy|skirt)/.test(n);
  },
  jackets: (p) => {
    const n = p.name.toLowerCase();
    return p.category === "Outerwear" || /(jacket|coat|puffer|parka|bomber|vest|windbreaker)/.test(n);
  },
  kicks: (p) => p.category === "Footwear" || /(sneaker|shoe|boot|trainer)/.test(p.name.toLowerCase()),
  accessories: (p) =>
    ["Accessories", "Bags", "Jewelry"].includes(p.category) ||
    /(hat|cap|beanie|bag|backpack|belt|scarf|sock|necklace|chain|ring|bracelet|earring|sunglass|wallet)/.test(p.name.toLowerCase()),
};

export default function Category() {
  const { gender, subcategory } = useParams<{ gender: string; subcategory: string }>();
  const label = SUBCATEGORY_LABELS[subcategory || ""] || subcategory;
  const genderLabel = gender === "him" ? "Him" : "Her";
  const matcher = MATCHERS[subcategory || ""];
  const filtered = matcher ? products.filter(matcher) : [];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <h1 className="mb-2 font-display text-3xl font-bold">{label}</h1>
        <p className="mb-8 text-muted-foreground">Shop {label} for {genderLabel}</p>

        {filtered.length > 0 ? (
          <div className="masonry-grid">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium">No products yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon — new drops coming.</p>
          </div>
        )}
      </div>
    </div>
  );
}
