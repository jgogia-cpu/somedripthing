import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Curated list of brands to keep in sync. Mirrors src/data/brands.ts (id, name, site).
// `usdBase: true` — shop currency isn't USD, so use the Shopify Markets
// USD-scoped feed for the stored base price instead of the shop default.
const BRANDS: Array<{ id: string; name: string; site: string; usdBase?: boolean }> = [
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
  { id: "45", name: "Don't Be Last", site: "https://dontbelastbrand.com" },
  { id: "46", name: "Ritual One", site: "https://ritualone.ca" },
  { id: "49", name: "Tarantulas", site: "https://tarantulasclub.com" },
  { id: "50", name: "DÉPRIMÉ", site: "https://deprime.shop" },
  { id: "51", name: "UNODENINGUNO", site: "https://unodeninguno.com", usdBase: true },
  { id: "52", name: "EXITUS", site: "https://exitusclothing.com.au", usdBase: true },
  { id: "53", name: "THREADED", site: "https://threadedwear.us" },
  { id: "55", name: "SYMAG", site: "https://symag-sg.com", usdBase: true },
  { id: "56", name: "13 by Rivera", site: "https://13byrivera.com" },
  { id: "59", name: "5K Enterprise", site: "https://www.5kenterprise.com" },
];

// Non-Shopify stores (ikas platform). Products are discovered through the
// store sitemap and parsed from each product page's JSON-LD block.
const IKAS_BRANDS: Array<{ id: string; name: string; site: string; sitemapHost: string }> = [
  {
    id: "47",
    name: "Vision",
    site: "https://snmzx-visiontr.myikas.com",
    sitemapHost: "https://visiontr.myikas.com",
  },
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

// --- ikas helpers -----------------------------------------------------------
const SIZE_MAP: Record<string, string> = {
  xs: "XS", s: "S", m: "M", l: "L", xl: "XL", xxl: "2XL", "2xl": "2XL", "3xl": "3XL",
};

async function tryToUsdRate(): Promise<number> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=TRY&to=USD", {
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = (await res.json()) as { rates?: { USD?: number } };
      if (json.rates?.USD && json.rates.USD > 0) return json.rates.USD;
    }
  } catch { /* fall through */ }
  return 0.024;
}

interface IkasProduct {
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  sizes: string[];
}

async function fetchIkasProduct(url: string): Promise<IkasProduct | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const blocks = Array.from(
      html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    ).map((m) => m[1]);
    for (const raw of blocks) {
      let data: Record<string, unknown>;
      try { data = JSON.parse(raw); } catch { continue; }
      if (data["@type"] !== "Product") continue;
      const offers = (Array.isArray(data.offers) ? data.offers : data.offers ? [data.offers] : []) as
        Array<{ price?: string; priceCurrency?: string; url?: string }>;
      const prices = offers
        .map((o) => parseFloat(String(o.price ?? "0")))
        .filter((p) => p > 0);
      if (!prices.length) continue;
      const sizes = Array.from(
        new Set(
          offers
            .map((o) => decodeURIComponent(o.url ?? "").match(/[?&](beden|size)=([^&?]+)/i)?.[2] ?? "")
            .map((s) => SIZE_MAP[s.toLowerCase()] ?? "")
            .filter(Boolean),
        ),
      ).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
      return {
        name: String(data.name ?? "Untitled").replace(/\s+/g, " ").trim(),
        description: String(data.description ?? "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 220),
        images: (Array.isArray(data.image) ? data.image : [data.image])
          .filter((i): i is string => typeof i === "string" && /^https?:\/\//.test(i)),
        price: Math.min(...prices),
        currency: String(offers[0]?.priceCurrency ?? "USD"),
        sizes,
      };
    }
    return null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const url = new URL(req.url);
  const brandFilter = url.searchParams.get("brand");
  const skipImageCheck = url.searchParams.get("skipImageCheck") === "1";
  const fast = url.searchParams.get("fast") === "1" || skipImageCheck;
  const background = url.searchParams.get("background") === "1";
  const targets = brandFilter
    ? BRANDS.filter((b) => b.id === brandFilter || b.name.toLowerCase() === brandFilter.toLowerCase())
    : BRANDS;
  const ikasTargets = brandFilter
    ? IKAS_BRANDS.filter((b) => b.id === brandFilter || b.name.toLowerCase() === brandFilter.toLowerCase())
    : IKAS_BRANDS;

  const run = async () => {
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

      // Fetch per-currency price maps in parallel. Skipped in `fast` mode
      // (used for large / bot-protected shops) — currency conversion falls
      // back to the live exchange-rate edge function on the client.
      const currencyMaps: Record<Currency, Map<string, number>> = {
        USD: new Map(), EUR: new Map(), GBP: new Map(), CAD: new Map(), AUD: new Map(),
      };
      if (!fast) {
        const fetched = await Promise.all(
          CURRENCIES.map((c) => fetchPricesForCurrency(brand.site, c).catch(() => new Map<string, number>())),
        );
        CURRENCIES.forEach((c, i) => { currencyMaps[c] = fetched[i]; });
      }

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
        const liveImage = fast ? imgs[0] ?? null : await firstLiveImage(imgs);
        if (!liveImage) continue;
        const orderedImgs = [liveImage, ...imgs.filter((img) => img !== liveImage)];
        const variants =
          (p.variants as Array<Record<string, string | null>> | undefined) ?? [];
        const rawPrice = parseFloat(String(variants[0]?.price ?? "0"));
        const price = brand.usdBase
          ? (currencyMaps.USD.get(handle) ?? rawPrice)
          : rawPrice;
        if (!price) continue;
        // Build native-price map. Skip currencies whose price equals the shop
        // default (Shopify without Markets returns the same number for every
        // `?currency=` request) — those aren't real conversions.
        const baseline = currencyMaps.USD.get(handle) ?? price;
        const prices: Partial<Record<Currency, number>> = {};
        for (const c of CURRENCIES) {
          const v = currencyMaps[c].get(handle);
          // For non-USD shops, a currency that still returns the raw shop-currency
          // number wasn't actually converted — skip it.
          if (brand.usdBase && c !== "USD" && v && Math.abs(v - rawPrice) < 0.01) continue;
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

    // ---- ikas-platform brands (sitemap + JSON-LD) ----
    for (const brand of ikasTargets) {
      try {
        const res = await fetch(`${brand.sitemapHost}/products.xml`, {
          headers: { "User-Agent": UA },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) {
          notes.push(`${brand.name}: sitemap HTTP ${res.status}`);
          continue;
        }
        const xml = await res.text();
        const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
        if (!urls.length) {
          notes.push(`${brand.name}: no products in sitemap`);
          continue;
        }
        const liveHandles = new Set(
          urls.map((u) => u.split("/").filter(Boolean).pop() ?? "").filter(Boolean),
        );

        const { data: existing } = await supabase
          .from("scraped_products")
          .select("handle")
          .eq("brand_id", brand.id);
        const have = new Set((existing ?? []).map((r) => r.handle));

        const stale = (existing ?? [])
          .map((r) => r.handle)
          .filter((h) => !liveHandles.has(h));
        if (stale.length) {
          await supabase
            .from("scraped_products")
            .delete()
            .eq("brand_id", brand.id)
            .in("handle", stale);
          totalRemoved += stale.length;
          stale.forEach((h) => have.delete(h));
        }

        const usdRate = await tryToUsdRate();
        const toInsert: Array<Record<string, unknown>> = [];
        for (const url of urls.slice(0, PER_BRAND_CAP)) {
          const handle = url.split("/").filter(Boolean).pop() ?? "";
          if (!handle || have.has(handle)) continue;
          const ld = await fetchIkasProduct(url);
          if (!ld) continue;
          const images = ld.images.slice(0, 4);
          if (!images.length) continue;
          const priceUsd = Math.round(ld.price * (ld.currency === "TRY" ? usdRate : 1));
          if (!priceUsd) continue;
          const { category, aesthetics } = categorize(ld.name);
          toInsert.push({
            brand_id: brand.id,
            brand_name: brand.name,
            handle,
            name: ld.name,
            image: images[0],
            images,
            price: priceUsd,
            prices: {},
            description:
              ld.description ||
              `${ld.name} from ${brand.name} — limited-run streetwear piece.`,
            category,
            aesthetics,
            sizes: ld.sizes.length ? ld.sizes : ["S", "M", "L", "XL"],
            affiliate_url: `${brand.site}/${handle}`,
          });
        }

        if (toInsert.length) {
          const { error } = await supabase
            .from("scraped_products")
            .upsert(toInsert, { onConflict: "brand_id,handle", ignoreDuplicates: true });
          if (error) notes.push(`${brand.name}: insert error ${error.message}`);
          else {
            totalAdded += toInsert.length;
            notes.push(`${brand.name}: +${toInsert.length}${stale.length ? ` / -${stale.length}` : ""}`);
          }
        } else {
          notes.push(`${brand.name}: 0 new${stale.length ? ` / -${stale.length}` : ""}`);
        }
      } catch (e) {
        notes.push(`${brand.name}: ${(e as Error).message}`);
      }
    }

    await supabase.from("scraper_runs").insert({
      brands_checked: targets.length + ikasTargets.length,
      products_added: totalAdded,
      notes: `removed:${totalRemoved} | ${notes.join(" | ")}`,
    });
    return { totalAdded, totalRemoved, notes };
  };

  if (background) {
    // deno-lint-ignore no-explicit-any
    (globalThis as any).EdgeRuntime?.waitUntil?.(run());
    return new Response(
      JSON.stringify({ ok: true, background: true, brands: targets.map((b) => b.name) }),
      { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const result = await run();
  return new Response(
    JSON.stringify({ ok: true, ...result }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});