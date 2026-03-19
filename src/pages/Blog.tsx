import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  const allPosts = [
    ...dbPosts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.cover_image_url || null,
      category: p.category,
      author: p.author,
      readTime: p.read_time,
      date: new Date(p.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    })),
    ...staticBlogPosts.map(p => ({ ...p, coverImage: p.coverImage || null })),
  ];

  const featured = allPosts[0];
  const secondary = allPosts.slice(1, 3);
  const rest = allPosts.slice(3);

  return (
    <div className="min-h-screen">
      {/* Minimal header */}
      <div className="border-b border-border/30 py-8">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight md:text-5xl">Editorial</h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-wide">Streetwear · Culture · Style · Trends</p>
        </div>
      </div>

      {loading ? (
        <div className="container py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded bg-muted" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Hero featured article — full width like Highsnobiety */}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className="group relative block">
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    {featured.category}
                  </span>
                  <h2 className="mt-2 max-w-3xl font-display text-3xl font-black leading-tight text-white md:text-5xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">{featured.excerpt}</p>
                  <p className="mt-3 text-xs text-white/50">
                    By {featured.author} · {featured.date}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Two-column secondary articles */}
          {secondary.length > 0 && (
            <div className="container py-8">
              <div className="grid gap-px bg-border/30 md:grid-cols-2">
                {secondary.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-background"
                  >
                    <Link to={`/blog/${post.slug}`} className="group flex gap-5 p-5 md:p-6">
                      {post.coverImage && (
                        <div className="w-32 flex-shrink-0 overflow-hidden rounded md:w-40">
                          <img src={post.coverImage} alt={post.title}
                            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{post.category}</span>
                        <h3 className="mt-1 font-display text-lg font-bold leading-tight md:text-xl">{post.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <p className="mt-2 text-xs text-muted-foreground">By {post.author}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Latest stories grid */}
          {rest.length > 0 && (
            <div className="border-t border-border/30">
              <div className="container py-10">
                <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Latest Stories</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link to={`/blog/${post.slug}`} className="group block">
                        {post.coverImage && (
                          <div className="overflow-hidden rounded">
                            <img src={post.coverImage} alt={post.title}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        )}
                        <div className={post.coverImage ? "mt-3" : ""}>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{post.category}</span>
                          <h3 className="mt-1 font-display text-base font-bold leading-tight">{post.title}</h3>
                          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                          <p className="mt-2 text-xs text-muted-foreground">By {post.author} · {post.readTime} min read</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
