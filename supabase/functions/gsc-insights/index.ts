import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE = "https://thedripway.com/";
const SITE_ENC = encodeURIComponent(SITE);

async function gscFetch(path: string, init: RequestInit = {}) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!GSC_KEY) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY missing");
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    throw new Error(`GSC ${path} ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Require an authenticated user
    const auth = req.headers.get("Authorization") || "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startD = new Date(today.getTime() - 28 * 24 * 3600 * 1000).toISOString().slice(0, 10);

    const [topPages, topQueries, sitemaps] = await Promise.all([
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({
          startDate: startD, endDate: end,
          dimensions: ["page"], rowLimit: 25,
        }),
      }).catch((e) => ({ error: String(e) })),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST",
        body: JSON.stringify({
          startDate: startD, endDate: end,
          dimensions: ["query"], rowLimit: 25,
        }),
      }).catch((e) => ({ error: String(e) })),
      gscFetch(`/webmasters/v3/sites/${SITE_ENC}/sitemaps`).catch((e) => ({ error: String(e) })),
    ]);

    return new Response(
      JSON.stringify({
        site: SITE,
        period: { startDate: startD, endDate: end },
        topPages, topQueries, sitemaps,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});