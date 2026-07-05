import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_brands",
  title: "List brands",
  description:
    "List distinct brands available in DRIPWAY's scraped product catalog, with product counts and a link to the brand page.",
  inputSchema: {
    limit: z.number().int().min(1).max(200).default(50).describe("Max brands to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("scraped_products")
      .select("brand_id, brand_name")
      .limit(2000);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const counts = new Map<string, { brand_id: string; brand_name: string; count: number }>();
    for (const row of data ?? []) {
      const key = row.brand_id ?? row.brand_name;
      if (!key) continue;
      const existing = counts.get(key);
      if (existing) existing.count++;
      else counts.set(key, { brand_id: row.brand_id, brand_name: row.brand_name, count: 1 });
    }
    const brands = Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((b) => ({ ...b, url: `https://thedripway.com/brand/${b.brand_id ?? ""}` }));
    return {
      content: [{ type: "text", text: JSON.stringify(brands) }],
      structuredContent: { brands },
    };
  },
});