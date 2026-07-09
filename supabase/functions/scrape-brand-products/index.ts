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
  { id: "32", name: "Justiniano", site: "https://justiniano.shop" },
  { id: "33", name: "Neutral State", site: "https://neutralstate.shop" },
  { id: "35", name: "EVARA", site: "https://shopevara.store" },
  { id: "38", name: "PRIESTHOOD", site: "https://priesthood.uk" },
  { id: "41", name: "ParrisHighOnFashion", site: "https://parrishighonfashion.com" },
  { id: "42", name: "City of Saints", site: "https://cityofsaints.store" },
  { id: "39", name: "ZeroDivision", site: "https://zerodvsn.com" },
  { id: "40", name: "All Dubs", site: "https://www.alldubsofficial.com" },
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

const PER_BRAND_CAP = 50; // cap newly-added per brand per run
const MAX_PAGES = 6; // up to 1,500 products per brand per run
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

async function checkUrl(url: string): Promise<boolean> {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  try {
    const head = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": UA, Accept: "image/avif,image/webp,image/*,*/*" },
      redirect: "follow",
    });
    if (head.ok) {
      const type = head.headers.get("content-type") ?? "";
      return !type || type.startsWith("image/") || type.includes("octet-stream");
    }
    if (![403, 405, 429].includes(head.status)) return false;
  } catch { /* fall through to ranged GET */ }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": UA,
        Accept: "image/avif,image/webp,image/*,*/*",
        Range: "bytes=0-1024",
      },
      redirect: "follow",
    });
    try { await res.arrayBuffer(); } catch { /* ignore */ }
    const type = res.headers.get("content-type") ?? "";
    return res.ok && (type.startsWith("image/") || type.includes("octet-stream"));
  } catch {
    return false;
  }
}

async function firstLiveImage(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    if (await checkUrl(url)) return url;
  }
  return null;
}

async function fetchAllProducts(site: string): Promise<{
  products: Array<Record<string, unknown>>;
  complete: boolean;
  error?: string;
}> {
  const all: Array<Record<string, unknown>> = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(
      `${site}/products.json?limit=250&page=${page}`,
      {
        headers: {
          "User-Agent":
            UA,
        },
      },
    );
    if (!res.ok) return { products: all, complete: false, error: `HTTP ${res.status}` };
    let batch: Array<Record<string, unknown>> = [];
    try {
      const json = (await res.json()) as { products?: Array<Record<string, unknown>> };
      batch = json.products ?? [];
    } catch {
      // Non-JSON response (e.g. HTML shop redirect) — treat as end of feed.
      return { products: all, complete: all.length > 0 };
    }
    all.push(...batch);
    if (batch.length < 250) return { products: all, complete: true };
  }
  return { products: all, complete: false, error: "hit MAX_PAGES" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  let totalAdded = 0;
  let totalRemoved = 0;
  const notes: string[] = [];

  for (const brand of BRANDS) {
    try {
      const { products, complete, error } = await fetchAllProducts(brand.site);
      if (!complete && products.length === 0) {
        notes.push(`${brand.name}: ${error ?? "fetch failed"}`);
        continue;
      }
      const liveHandles = new Set(
        products.map((p) => String(p.handle ?? "")).filter(Boolean),
      );

      // Existing handles for this brand
      const { data: existing } = await supabase
        .from("scraped_products")
        .select("handle, image, images")
        .eq("brand_id", brand.id);
      const have = new Set((existing ?? []).map((r) => r.handle));

      // --- Cleanup: only remove products no longer live, and only when the
      // brand's live listing was fetched completely (otherwise pagination
      // gaps would wrongly delete real products). Image validity is handled
      // by the separate validate-products cron.
      const toDelete: string[] = [];
      if (complete) {
        for (const row of existing ?? []) {
          if (!liveHandles.has(row.handle)) toDelete.push(row.handle);
        }
      }
      for (const row of existing ?? []) {
        const imageUrls = Array.isArray(row.images) && row.images.length
          ? row.images.filter((url): url is string => typeof url === "string")
          : [row.image].filter((url): url is string => typeof url === "string");
        if (imageUrls.length === 0 || !(await firstLiveImage(imageUrls))) {
          toDelete.push(row.handle);
        }
      }
      if (toDelete.length) {
        const { error: delErr } = await supabase
          .from("scraped_products")
          .delete()
          .eq("brand_id", brand.id)
          .in("handle", toDelete);
        if (delErr) {
          notes.push(`${brand.name}: delete error ${delErr.message}`);
        } else {
          totalRemoved += toDelete.length;
          toDelete.forEach((h) => have.delete(h));
        }
      }

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
        const imgs = images.slice(0, 4).map((i) => i.src).filter(Boolean);
        const liveImage = await firstLiveImage(imgs);
        if (!liveImage) continue;
        const orderedImgs = [liveImage, ...imgs.filter((img) => img !== liveImage)];
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
          image: liveImage,
          images: orderedImgs,
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
          .upsert(toInsert, { onConflict: "brand_id,handle", ignoreDuplicates: true });
        if (error) {
          notes.push(`${brand.name}: insert error ${error.message}`);
        } else {
          totalAdded += toInsert.length;
          notes.push(
            `${brand.name}: +${toInsert.length}${toDelete.length ? ` / -${toDelete.length}` : ""}`,
          );
        }
      } else {
        notes.push(
          `${brand.name}: 0 new${toDelete.length ? ` / -${toDelete.length}` : ""}`,
        );
      }
    } catch (e) {
      notes.push(`${brand.name}: ${(e as Error).message}`);
    }
  }

  await supabase.from("scraper_runs").insert({
    brands_checked: BRANDS.length,
    products_added: totalAdded,
    notes: `removed:${totalRemoved} | ${notes.join(" | ")}`,
  });

  return new Response(
    JSON.stringify({ ok: true, totalAdded, totalRemoved, notes }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});