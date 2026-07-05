import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search DRIPWAY's scraped product catalog by keyword. Optionally filter by brand name. Returns products with name, brand, price, image, and affiliate URL.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Keyword to match against product name or description."),
    brand_name: z.string().trim().optional().describe("Optional brand name filter (case-insensitive)."),
    limit: z.number().int().min(1).max(50).default(10).describe("Max results (1-50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, brand_name, limit }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let q = supabase
      .from("scraped_products")
      .select("id, name, brand_name, brand_id, price, image, affiliate_url, category, description")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);
    if (brand_name) q = q.ilike("brand_name", `%${brand_name}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});