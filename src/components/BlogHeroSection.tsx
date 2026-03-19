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
  category: string;
  author: string;
}

export default function BlogHeroSection() {
  const [latestPosts, setLatestPosts] = useState<BlogPreview[]>([]);

  useEffect(() => {
    async function fetchLatest() {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, author")
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
            category: p.category,
            author: p.author,
          }))
        );
      }
    }
    fetchLatest();
  }, []);

  if (latestPosts.length === 0) return null;

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  {post.category}
                </span>
                <h3 className="mt-1 font-display text-sm font-bold leading-snug line-clamp-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <p className="mt-1.5 text-[10px] text-muted-foreground/60">By {post.author}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
