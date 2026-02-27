import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/brands";

const SUBCATEGORY_MAP: Record<string, string[]> = {
  hoodies: ["Tops"],
  shirts: ["Tops"],
  sweaters: ["Knitwear", "Tops"],
  denim: ["Bottoms"],
  bottoms: ["Bottoms"],
  jackets: ["Outerwear"],
  kicks: ["Footwear"],
  accessories: ["Accessories", "Bags", "Jewelry"],
};

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

export default function Category() {
  const { gender, subcategory } = useParams<{ gender: string; subcategory: string }>();
  const label = SUBCATEGORY_LABELS[subcategory || ""] || subcategory;
  const genderLabel = gender === "him" ? "Him" : "Her";
  const categories = SUBCATEGORY_MAP[subcategory || ""] || [];

  const filtered = products.filter(p => {
    if (!categories.length) return false;
    // Match by category mapping — for hoodies, filter tops that have "hoodie" in name
    if (subcategory === "hoodies") return p.name.toLowerCase().includes("hoodie") || p.name.toLowerCase().includes("zip-up");
    if (subcategory === "shirts") return categories.includes(p.category) && !p.name.toLowerCase().includes("hoodie") && !p.name.toLowerCase().includes("zip-up") && p.category === "Tops";
    if (subcategory === "sweaters") return categories.includes(p.category);
    if (subcategory === "jackets") return categories.includes(p.category);
    return categories.includes(p.category);
  });

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
