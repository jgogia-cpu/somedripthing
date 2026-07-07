// Generates public/products-manifest.json from src/data/brands.ts.
// The validate-products edge function reads this manifest to check
// every product's image + affiliate URL daily.
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

interface ManifestItem {
  id: string;
  brandId: string;
  image: string;
  affiliateUrl: string;
}

const src = readFileSync(resolve("src/data/brands.ts"), "utf8");

// Match each product object literal (single-line format used throughout brands.ts).
// We only care about products whose image is a plain http(s) URL string —
// products using imported image assets (starting with a variable) can't be
// validated remotely and are skipped.
const re = /\{\s*id:\s*"(p[^"]+)"[^}]*?brandId:\s*"([^"]+)"[^}]*?image:\s*"(https?:\/\/[^"]+)"[^}]*?affiliateUrl:\s*"(https?:\/\/[^"]+)"/g;

const items: ManifestItem[] = [];
for (const m of src.matchAll(re)) {
  items.push({ id: m[1], brandId: m[2], image: m[3], affiliateUrl: m[4] });
}

writeFileSync(
  resolve("public/products-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), products: items }, null, 2),
);
console.log(`products-manifest.json: ${items.length} products`);