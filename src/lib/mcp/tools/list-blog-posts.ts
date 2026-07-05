import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_blog_posts",
  title: "List editorial posts",
  description: "List DRIPWAY editorial blog posts (title, slug, excerpt, category, date).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(10),
    category: z.string().trim().optional().describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let q = supabase
      .from("blog_posts")
      .select("title, slug, excerpt, category, author, read_time, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const posts = (data ?? []).map((p) => ({
      ...p,
      url: `https://thedripway.com/blog/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(posts) }],
      structuredContent: { posts },
    };
  },
});