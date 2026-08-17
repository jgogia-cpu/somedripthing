import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/data/brands";
import Breadcrumbs from "@/components/Breadcrumbs";

function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k: number; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const rng = mulberry32(cyrb128(seed));
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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

/**
 * Name-first classification. We trust the product NAME over the loosely-typed
 * `category` field because the dataset has lots of sweatsuits/tracksuits/varsity
 * tagged as "Tops" or "Bottoms" inconsistently. Each matcher returns true only
 * when the name unambiguously describes that garment type.
 */
const RX = {
  hoodie: /\b(hoodie|hooded|zip[- ]?up hoodie|zip[- ]?hoodie)\b/,
  sweater: /\b(sweater|sweatshirt|crewneck|crew neck|knit|knitwear|cardigan|jumper|pullover|turtleneck|mockneck)\b/,
  shirt: /\b(shirt|t[- ]?shirt|tee|tees|polo|jersey|blouse|button[- ]?(up|down)|long[- ]?sleeve|longsleeve|tank|camisole|halter)\b/,
  jeans: /\b(jean|jeans|denim)\b/,
  pants: /\b(pant|pants|trouser|trousers|jogger|joggers|short|shorts|cargo|sweatpant|sweatpants|sweats|trackpant|trackpants|track pant|baggy|skirt|leggings|tights|chino|chinos|bottom|bottoms)\b/,
  jacket: /\b(jacket|coat|puffer|parka|bomber|vest|windbreaker|gilet|anorak|blazer|varsity|overshirt|shacket|outerwear)\b/,
  set: /\b(sweatsuit|tracksuit|trackset|two[- ]?piece|set|coord|coordinate)\b/,
  footwear: /\b(sneaker|sneakers|shoe|shoes|boot|boots|trainer|trainers|loafer|sandal|slide|cleat)\b/,
  accessory:
    /\b(hat|cap|beanie|bucket|bag|backpack|tote|belt|scarf|sock|socks|necklace|chain|ring|bracelet|earring|sunglass|sunglasses|wallet|gloves|keychain|patch|sticker|pin)\b/,
};

const MATCHERS: Record<string, (p: Product) => boolean> = {
  hoodies: (p) => {
    const n = p.name.toLowerCase();
    if (RX.set.test(n) || RX.jacket.test(n)) return false;
    return RX.hoodie.test(n);
  },
  sweaters: (p) => {
    const n = p.name.toLowerCase();
    if (RX.hoodie.test(n)) return false;
    if (RX.set.test(n) || RX.jacket.test(n)) return false;
    if (p.category === "Knitwear") return true;
    return RX.sweater.test(n);
  },
  shirts: (p) => {
    const n = p.name.toLowerCase();
    // Must be an actual shirt-type top — never a hoodie, sweater, jacket,
    // pants/denim, set, or footwear.
    if (RX.hoodie.test(n) || RX.sweater.test(n) || RX.jacket.test(n)) return false;
    if (RX.set.test(n)) return false;
    if (RX.pants.test(n) || RX.jeans.test(n)) return false;
    if (RX.footwear.test(n) || RX.accessory.test(n)) return false;
    return RX.shirt.test(n);
  },
  denim: (p) => {
    const n = p.name.toLowerCase();
    if (!RX.jeans.test(n)) return false;
    // exclude denim jackets, denim shirts, denim accessories
    if (RX.jacket.test(n) || RX.shirt.test(n) || RX.accessory.test(n)) return false;
    return true;
  },
  bottoms: (p) => {
    const n = p.name.toLowerCase();
    if (RX.jeans.test(n)) return false; // denim has its own bucket
    if (RX.jacket.test(n) || RX.hoodie.test(n) || RX.sweater.test(n) || RX.shirt.test(n)) return false;
    if (RX.footwear.test(n) || RX.accessory.test(n)) return false;
    // sweatsuits/tracksuits include pants — include here so the set is shoppable
    if (RX.set.test(n)) return true;
    return RX.pants.test(n);
  },
  jackets: (p) => {
    const n = p.name.toLowerCase();
    if (RX.hoodie.test(n) && !RX.jacket.test(n)) return false;
    return RX.jacket.test(n) || p.category === "Outerwear";
  },
  kicks: (p) => {
    const n = p.name.toLowerCase();
    return p.category === "Footwear" || RX.footwear.test(n);
  },
  accessories: (p) => {
    const n = p.name.toLowerCase();
    if (["Accessories", "Bags", "Jewelry"].includes(p.category)) return true;
    if (RX.hoodie.test(n) || RX.sweater.test(n) || RX.shirt.test(n)) return false;
    if (RX.pants.test(n) || RX.jeans.test(n) || RX.jacket.test(n)) return false;
    if (RX.footwear.test(n) || RX.set.test(n)) return false;
    return RX.accessory.test(n);
  },
};

const INITIAL_VISIBLE = 24;
const LOAD_MORE = 24;

export default function Category() {
  const { gender, subcategory } = useParams<{ gender: string; subcategory: string }>();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const label = SUBCATEGORY_LABELS[subcategory || ""] || subcategory;
  const genderLabel = gender === "him" ? "Him" : "Her";
  const matcher = MATCHERS[subcategory || ""];
  const filtered = matcher ? products.filter(matcher) : [];
  const visibleProducts = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [gender, subcategory]);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <Breadcrumbs
          className="mb-4"
          items={[
            { label: `Shop ${genderLabel}`, to: `/shop/${gender}/hoodies` },
            { label: label || "" },
          ]}
        />
        <h1 className="mb-2 font-display text-3xl font-bold">{label}</h1>
        <p className="mb-8 text-muted-foreground">Shop {label} for {genderLabel}</p>

        {filtered.length > 0 ? (
          <>
            <div className="masonry-grid">
              {visibleProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + LOAD_MORE)}
                  className="rounded-full border border-border/60 px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Load more
                </button>
              </div>
            )}
          </>
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
