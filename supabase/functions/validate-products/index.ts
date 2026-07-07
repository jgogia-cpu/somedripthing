import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

interface ManifestItem {
  id: string;
  brandId: string;
  image: string;
  affiliateUrl: string;
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number }> {
  // Try HEAD first (cheap). If the server rejects HEAD (405/403), fall back to
  // a GET with a small range so we don't download the whole page/image.
  try {
    const head = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": UA, Accept: "*/*" },
      redirect: "follow",
    });
    if (head.status < 400) return { ok: true, status: head.status };
    if (head.status !== 405 && head.status !== 403 && head.status !== 429) {
      return { ok: false, status: head.status };
    }
  } catch { /* fall through to GET */ }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Accept: "*/*", Range: "bytes=0-1024" },
      redirect: "follow",
    });
    // Drain small body so the connection can close cleanly.
    try { await res.arrayBuffer(); } catch { /* ignore */ }
    return { ok: res.status < 400, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function loadManifest(): Promise<ManifestItem[]> {
  // Fetch the manifest generated at build time from the published site.
  const candidates = [
    "https://www.thedripway.com/products-manifest.json",
    "https://thedripway.com/products-manifest.json",
    "https://somedripthing.lovable.app/products-manifest.json",
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const json = await res.json() as { products: ManifestItem[] };
      if (Array.isArray(json.products) && json.products.length) return json.products;
    } catch { /* try next */ }
  }
  return [];
}

// Simple concurrency limiter so we don't hammer any single brand site.
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (t: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const manifest = await loadManifest();
  if (!manifest.length) {
    return new Response(
      JSON.stringify({ ok: false, error: "manifest_unavailable" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const results = await mapWithLimit(manifest, 8, async (p) => {
    const img = await checkUrl(p.image);
    // Only check affiliate URL when image passes — dead image alone is enough.
    const aff = img.ok
      ? await checkUrl(p.affiliateUrl)
      : { ok: false, status: 0 };
    let reason: string | null = null;
    if (!img.ok) reason = `image_${img.status}`;
    else if (!aff.ok) reason = `affiliate_${aff.status}`;
    return { id: p.id, reason };
  });

  const invalid = results.filter((r) => r.reason);
  const validIds = results.filter((r) => !r.reason).map((r) => r.id);

  if (invalid.length) {
    const rows = invalid.map((r) => ({ product_id: r.id, reason: r.reason! }));
    await supabase.from("hidden_products").upsert(rows, { onConflict: "product_id" });
  }
  if (validIds.length) {
    // Unhide anything that now passes.
    await supabase.from("hidden_products").delete().in("product_id", validIds);
  }

  await supabase.from("scraper_runs").insert({
    brands_checked: 0,
    products_added: 0,
    notes: `validate-products: checked=${manifest.length} hidden=${invalid.length}`,
  });

  return new Response(
    JSON.stringify({
      ok: true,
      checked: manifest.length,
      hidden: invalid.length,
      hiddenIds: invalid.slice(0, 100).map((r) => r.id),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});