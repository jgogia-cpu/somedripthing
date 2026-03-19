import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticBlogPosts } from "@/data/brands";

interface BlogPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  author: string;
}

export default function BlogHeroSection() {
  const [latestPosts, setLatestPosts] = useState<BlogPreview[]>([]);

  useEffect(() => {
    async function fetchLatest() {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, category, author")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (data && data.length > 0) {
        setLatestPosts(
          (data as any[]).map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            coverImage: p.cover_image_url,
            category: p.category,
            author: p.author,
          }))
        );
      } else {
        setLatestPosts(
          staticBlogPosts.slice(0, 4).map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            coverImage: p.coverImage || null,
            category: p.category,
            author: p.author,
          }))
        );
      }
    }
    fetchLatest();
  }, []);

  if (latestPosts.length === 0) return null;

  const featured = latestPosts[0];
  const rest = latestPosts.slice(1);

  return (
    <section className="border-t border-border/30 py-10">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">The Edit</h2>
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Featured post with cover image */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to={`/blog/${featured.slug}`} className="group block overflow-hidden rounded-lg">
              {featured.coverImage && (
                <div className="overflow-hidden">
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {featured.category}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold leading-tight group-hover:text-accent transition-colors md:text-2xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{featured.excerpt}</p>
                <p className="mt-2 text-xs text-muted-foreground/60">By {featured.author}</p>
              </div>
            </Link>
          </motion.div>

          {/* Rest stacked */}
          <div className="flex flex-col gap-4">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.08, duration: 0.4 }}
              >
                <Link to={`/blog/${post.slug}`} className="group flex gap-4 rounded-lg border border-border/30 p-3 hover:border-border/60 transition-colors">
                  {post.coverImage && (
                    <div className="w-24 flex-shrink-0 overflow-hidden rounded">
                      <img src={post.coverImage} alt={post.title} className="aspect-square w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                      {post.category}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-bold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
