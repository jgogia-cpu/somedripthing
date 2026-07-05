import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_blog_post",
  title: "Get editorial post",
  description: "Fetch the full content of a DRIPWAY editorial post by slug.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Blog post slug from list_blog_posts."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, content, category, author, read_time, cover_image_url, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Post not found" }], isError: true };
    const post = { ...data, url: `https://thedripway.com/blog/${data.slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(post) }],
      structuredContent: { post },
    };
  },
});