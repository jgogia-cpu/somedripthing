import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Curated list of brands to keep in sync. Mirrors src/data/brands.ts (id, name, site).
const BRANDS: Array<{ id: string; name: string; site: string }> = [
  { id: "17", name: "Drip by Rage", site: "https://dripbyrage.store" },
  { id: "24", name: "Preview Worldwide", site: "https://previewworldwide.com" },
  { id: "25", name: "SABR", site: "https://sabrclothing2024.com" },
  { id: "26", name: "Fortune Fellas Club", site: "https://fortunefellasclub.com" },
  { id: "27", name: "House of Kings", site: "https://houseofkings.co" },
  { id: "28", name: "Harvx", site: "https://harvxclo.com" },
  { id: "29", name: "MorteNoir", site: "https://mortenoir.co.uk" },
  { id: "30", name: "Isolated", site: "https://isolated.shop" },
  { id: "31", name: "Maker Creator", site: "https://makercreator.ca" },
];

const SIZES_OK = new Set([
  "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "One Size",
]);
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "One Size"];

function categorize(title: string): { category: string; aesthetics: string[] } {
  const t = title.toLowerCase();
  if (/(pant|jogger|baggy|short|trouser)/.test(t))
    return { category: "Bottoms", aesthetics: ["Streetwear"] };
  if (/(jacket|coat|puffer)/.test(t))
    return { category: "Outerwear", aesthetics: ["Streetwear"] };
  if (/(hoodie|sweatshirt|crewneck)/.test(t))
    return { category: "Tops", aesthetics: ["Streetwear", "Grunge"] };
  if (/(hat|cap|beanie|bag|backpack)/.test(t))
    return { category: "Accessories", aesthetics: ["Streetwear"] };
  return { category: "Tops", aesthetics: ["Streetwear"] };
}

function extractSizes(variants: Array<Record<string, string | null>>): string[] {
  for (const opt of ["option1", "option2", "option3"] as const) {
    const cand = variants
      .map((v) => v[opt])
      .filter((s): s is string => !!s && SIZES_OK.has(s));
    if (cand.length) {
      return Array.from(new Set(cand)).sort(
        (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b),
      );
    }
  }
  return ["S", "M", "L", "XL"];
}

const PER_BRAND_CAP = 10; // cap newly-added per brand per run

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  let totalAdded = 0;
  const notes: string[] = [];

  for (const brand of BRANDS) {
    try {
      const res = await fetch(`${brand.site}/products.json?limit=250`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        },
      });
      if (!res.ok) {
        notes.push(`${brand.name}: HTTP ${res.status}`);
        continue;
      }
      const json = await res.json() as { products?: Array<Record<string, unknown>> };
      const products = json.products ?? [];

      // Existing handles for this brand
      const { data: existing } = await supabase
        .from("scraped_products")
        .select("handle")
        .eq("brand_id", brand.id);
      const have = new Set((existing ?? []).map((r) => r.handle));

      // Sort newest first by published_at
      const sorted = [...products].sort((a, b) => {
        const ad = String(a.published_at ?? a.created_at ?? "");
        const bd = String(b.published_at ?? b.created_at ?? "");
        return bd.localeCompare(ad);
      });

      const toInsert: Array<Record<string, unknown>> = [];
      for (const p of sorted) {
        if (toInsert.length >= PER_BRAND_CAP) break;
        const handle = String(p.handle ?? "");
        if (!handle || have.has(handle)) continue;
        const images = (p.images as Array<{ src: string }> | undefined) ?? [];
        if (!images.length) continue;
        const imgs = images.slice(0, 4).map((i) => i.src);
        const variants =
          (p.variants as Array<Record<string, string | null>> | undefined) ?? [];
        const price = parseFloat(String(variants[0]?.price ?? "0"));
        if (!price) continue;
        const title = String(p.title ?? "Untitled");
        const { category, aesthetics } = categorize(title);
        const desc =
          String(p.body_html ?? "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 220) ||
          `${title} from ${brand.name} — premium streetwear piece.`;

        toInsert.push({
          brand_id: brand.id,
          brand_name: brand.name,
          handle,
          name: title,
          image: imgs[0],
          images: imgs,
          price,
          description: desc,
          category,
          aesthetics,
          sizes: extractSizes(variants),
          affiliate_url: `${brand.site}/products/${handle}`,
        });
      }

      if (toInsert.length) {
        const { error } = await supabase
          .from("scraped_products")
          .insert(toInsert);
        if (error) {
          notes.push(`${brand.name}: insert error ${error.message}`);
        } else {
          totalAdded += toInsert.length;
          notes.push(`${brand.name}: +${toInsert.length}`);
        }
      } else {
        notes.push(`${brand.name}: 0 new`);
      }
    } catch (e) {
      notes.push(`${brand.name}: ${(e as Error).message}`);
    }
  }

  await supabase.from("scraper_runs").insert({
    brands_checked: BRANDS.length,
    products_added: totalAdded,
    notes: notes.join(" | "),
  });

  return new Response(
    JSON.stringify({ ok: true, totalAdded, notes }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});