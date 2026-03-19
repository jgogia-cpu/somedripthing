import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticBlogPosts } from "@/data/brands";

interface BlogPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
}

export default function BlogHeroSection() {
  const [latestPosts, setLatestPosts] = useState<BlogPreview[]>([]);

  useEffect(() => {
    async function fetchLatest() {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, category")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setLatestPosts(
          (data as any[]).map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            coverImage: p.cover_image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
            category: p.category,
          }))
        );
      } else {
        // Fallback to static posts
        setLatestPosts(
          staticBlogPosts.slice(0, 3).map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            coverImage: p.coverImage,
            category: p.category,
          }))
        );
      }
    }
    fetchLatest();
  }, []);

  return (
    <section className="border-b border-border/50 bg-secondary/20 py-10">
      <div className="container">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl font-bold">The Edit</h2>
            <span className="ml-2 flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              <Sparkles className="h-3 w-3" /> AI-Powered Daily
            </span>
          </div>
          <Link to="/blog">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
              Read All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {latestPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    {post.category}
                  </span>
                  <h3 className="mt-0.5 text-sm font-semibold leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/blog">
            <Button className="gap-2 rounded-full">
              <Newspaper className="h-4 w-4" /> Read the Editorial
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" className="rounded-full">
              Discover Brands
            </Button>
          </Link>
          <Link to="/collections">
            <Button variant="outline" className="rounded-full">
              Weekly Picks
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
