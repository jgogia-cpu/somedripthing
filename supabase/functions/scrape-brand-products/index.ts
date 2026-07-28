import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

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
  { id: "33", name: "Neutral State", site: "https://neutralstate.shop" },
  { id: "35", name: "EVARA", site: "https://shopevara.store" },
  { id: "38", name: "PRIESTHOOD", site: "https://priesthood.uk" },
  { id: "41", name: "ParrisHighOnFashion", site: "https://parrishighonfashion.com" },
  { id: "42", name: "City of Saints", site: "https://cityofsaints.store" },
  { id: "39", name: "ZeroDivision", site: "https://zerodvsn.com" },
  { id: "40", name: "All Dubs", site: "https://www.alldubsofficial.com" },
  { id: "43", name: "Driven By Success", site: "https://drivenbysuccess.store" },
  { id: "44", name: "DREKN", site: "https://drekn.com" },
  { id: "45", name: "Don't Be Last Brand", site: "https://dontbelastbrand.com" },
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

const PER_BRAND_CAP = 1500; // effectively "all products"
const MAX_PAGES = 8; // up to 2,000 products per brand per run
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const;
type Currency = typeof CURRENCIES[number];
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

async function checkUrl(url: string): Promise<boolean> {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  try {
    const head = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": UA, Accept: "image/avif,image/webp,image/*,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
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
      signal: AbortSignal.timeout(6000),
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

// Fetch a currency-scoped copy of the brand's product feed and return a
// handle -> price map for the requested currency. Shopify Markets stores
// honor the `?currency=` query on /products.json; stores without Markets
// simply return the same shop-currency price for every request, so the
// caller compares against the USD baseline before persisting.
async function fetchPricesForCurrency(
  site: string,
  currency: Currency,
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  for (let page = 1; page <= MAX_PAGES; page++) {
    let res: Response;
    try {
      res = await fetch(
        `${site}/products.json?limit=250&page=${page}&currency=${currency}`,
        {
          headers: { "User-Agent": UA, "Accept-Language": "en" },
          signal: AbortSignal.timeout(15000),
        },
      );
    } catch {
      return map;
    }
    if (!res.ok) return map;
    let batch: Array<Record<string, unknown>> = [];
    try {
      const json = (await res.json()) as { products?: Array<Record<string, unknown>> };
      batch = json.products ?? [];
    } catch {
      return map;
    }
    for (const p of batch) {
      const handle = String(p.handle ?? "");
      if (!handle) continue;
      const variants = (p.variants as Array<Record<string, string | null>> | undefined) ?? [];
      const price = parseFloat(String(variants[0]?.price ?? "0"));
      if (price > 0) map.set(handle, price);
    }
    if (batch.length < 250) return map;
  }
  return map;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const url = new URL(req.url);
  const brandFilter = url.searchParams.get("brand");
  const skipImageCheck = url.searchParams.get("skipImageCheck") === "1";
  const targets = brandFilter
    ? BRANDS.filter((b) => b.id === brandFilter || b.name.toLowerCase() === brandFilter.toLowerCase())
    : BRANDS;

  let totalAdded = 0;
  let totalRemoved = 0;
  const notes: string[] = [];

  for (const brand of targets) {
    try {
      const { products, complete, error } = await fetchAllProducts(brand.site);
      if (!complete && products.length === 0) {
        notes.push(`${brand.name}: ${error ?? "fetch failed"}`);
        continue;
      }
      const liveHandles = new Set(
        products.map((p) => String(p.handle ?? "")).filter(Boolean),
      );

      // Fetch per-currency price maps in parallel. USD map doubles as the
      // baseline for detecting whether the shop actually honored `?currency=`.
      const currencyMaps: Record<Currency, Map<string, number>> = {
        USD: new Map(), EUR: new Map(), GBP: new Map(), CAD: new Map(), AUD: new Map(),
      };
      const fetched = await Promise.all(
        CURRENCIES.map((c) => fetchPricesForCurrency(brand.site, c).catch(() => new Map<string, number>())),
      );
      CURRENCIES.forEach((c, i) => { currencyMaps[c] = fetched[i]; });

      // Existing handles for this brand
      const { data: existing } = await supabase
        .from("scraped_products")
        .select("handle, image, images, prices")
        .eq("brand_id", brand.id);
      const have = new Set((existing ?? []).map((r) => r.handle));

      // --- Cleanup: remove products no longer live, and remove anything whose
      // images are missing. Live-listing deletes only run when the brand feed
      // was fetched completely, otherwise pagination gaps could delete real
      // products.
      const toDelete = new Set<string>();
      if (complete) {
        for (const row of existing ?? []) {
          if (!liveHandles.has(row.handle)) toDelete.add(row.handle);
        }
      }
      if (!skipImageCheck) for (const row of existing ?? []) {
        const imageUrls = Array.isArray(row.images) && row.images.length
          ? row.images.filter((url): url is string => typeof url === "string")
          : [row.image].filter((url): url is string => typeof url === "string");
        if (imageUrls.length === 0 || !(await firstLiveImage(imageUrls))) {
          toDelete.add(row.handle);
        }
      }
      const toDeleteHandles = Array.from(toDelete).filter(Boolean);
      if (toDeleteHandles.length) {
        const { error: delErr } = await supabase
          .from("scraped_products")
          .delete()
          .eq("brand_id", brand.id)
          .in("handle", toDeleteHandles);
        if (delErr) {
          notes.push(`${brand.name}: delete error ${delErr.message}`);
        } else {
          totalRemoved += toDeleteHandles.length;
          toDeleteHandles.forEach((h) => have.delete(h));
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
        // Build native-price map. Skip currencies whose price equals the shop
        // default (Shopify without Markets returns the same number for every
        // `?currency=` request) — those aren't real conversions.
        const baseline = currencyMaps.USD.get(handle) ?? price;
        const prices: Partial<Record<Currency, number>> = {};
        for (const c of CURRENCIES) {
          const v = currencyMaps[c].get(handle);
          if (v && v > 0 && (c === "USD" || Math.abs(v - baseline) > 0.01)) {
            prices[c] = v;
          }
        }
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
          prices,
          description: desc,
          category,
          aesthetics,
          sizes: extractSizes(variants),
          affiliate_url: `${brand.site}/products/${handle}`,
        });
      }

      // Backfill: refresh `prices` on existing rows whose native-currency data
      // is empty so the same daily run enriches the whole catalog over time.
      const backfillUpdates: Array<{ handle: string; prices: Record<string, number> }> = [];
      for (const row of existing ?? []) {
        const current = (row as { prices?: Record<string, number> }).prices ?? {};
        const hasExtras = Object.keys(current).some((k) => k !== "USD");
        if (hasExtras) continue;
        const baseline = currencyMaps.USD.get(row.handle);
        if (!baseline) continue;
        const next: Record<string, number> = {};
        for (const c of CURRENCIES) {
          const v = currencyMaps[c].get(row.handle);
          if (v && v > 0 && (c === "USD" || Math.abs(v - baseline) > 0.01)) {
            next[c] = v;
          }
        }
        if (Object.keys(next).length > 1) backfillUpdates.push({ handle: row.handle, prices: next });
      }
      for (const u of backfillUpdates.slice(0, 200)) {
        await supabase
          .from("scraped_products")
          .update({ prices: u.prices })
          .eq("brand_id", brand.id)
          .eq("handle", u.handle);
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
            `${brand.name}: +${toInsert.length}${toDeleteHandles.length ? ` / -${toDeleteHandles.length}` : ""}`,
          );
        }
      } else {
        notes.push(
          `${brand.name}: 0 new${toDeleteHandles.length ? ` / -${toDeleteHandles.length}` : ""}`,
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