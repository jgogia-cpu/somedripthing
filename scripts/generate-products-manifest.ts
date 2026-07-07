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

// Split by each product's opening `{ id: "p...` marker and inspect each block
// independently so field ordering doesn't matter. Only include products whose
// image + affiliate URL are plain http(s) strings (imported image assets can't
// be validated remotely and are skipped).
const items: ManifestItem[] = [];
const parts = src.split(/(?=\{\s*id:\s*"p[^"]+")/);
for (const block of parts) {
  const idM = block.match(/^\{\s*id:\s*"(p[^"]+)"/);
  if (!idM) continue;
  const brandM = block.match(/brandId:\s*"([^"]+)"/);
  const imgM = block.match(/image:\s*"(https?:\/\/[^"]+)"/);
  const affM = block.match(/affiliateUrl:\s*"(https?:\/\/[^"]+)"/);
  if (!brandM || !imgM || !affM) continue;
  items.push({ id: idM[1], brandId: brandM[1], image: imgM[1], affiliateUrl: affM[1] });
}

writeFileSync(
  resolve("public/products-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), products: items }, null, 2),
);
console.log(`products-manifest.json: ${items.length} products`);