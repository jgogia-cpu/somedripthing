import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticBlogPosts } from "@/data/brands";

interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  category: string;
  author: string;
  read_time: number;
  created_at: string;
}

export default function Blog() {
  const [dbPosts, setDbPosts] = useState<DbBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(50);
      setDbPosts((data as DbBlogPost[]) || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Merge: DB posts first, then static posts as fallback
  const allPosts = [
    ...dbPosts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.cover_image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
      category: p.category,
      author: p.author,
      readTime: p.read_time,
      date: new Date(p.created_at).toLocaleDateString(),
      isDb: true,
    })),
    ...staticBlogPosts.map(p => ({ ...p, isDb: false })),
  ];

  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* SEO Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="h-5 w-5 text-accent" />
            <h1 className="font-display text-3xl font-bold">Editorial</h1>
          </div>
          <p className="text-muted-foreground">Brand spotlights, trend reports, style guides, and streetwear culture — updated daily.</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg bg-muted" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group mb-12 block">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-xl">
                    <img src={featured.coverImage} alt={featured.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent">{featured.category}</span>
                    <h2 className="mt-2 font-display text-3xl font-bold leading-tight">{featured.title}</h2>
                    <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                    <p className="mt-4 text-sm text-muted-foreground">By {featured.author} · {featured.readTime} min read</p>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="overflow-hidden rounded-lg">
                      <img src={post.coverImage} alt={post.title}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">{post.category}</span>
                      <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{post.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{post.readTime} min read</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
