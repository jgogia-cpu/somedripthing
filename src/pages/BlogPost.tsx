import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticBlogPosts, products } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  author: string;
  read_time: number;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [dbPost, setDbPost] = useState<DbBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  const inlineProducts = useMemo(() => {
    if (!slug) return [];
    let seed = 0;
    for (let i = 0; i < slug.length; i++) seed = ((seed << 5) - seed + slug.charCodeAt(i)) | 0;
    const shuffled = [...products].sort((a, b) => {
      const ha = ((seed + a.id.charCodeAt(1)) * 2654435761) >>> 0;
      const hb = ((seed + b.id.charCodeAt(1)) * 2654435761) >>> 0;
      return ha - hb;
    });
    return shuffled.slice(0, 6);
  }, [slug]);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setDbPost(data as DbBlogPost | null);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  const staticPost = staticBlogPosts.find(p => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-2xl animate-pulse">
          <div className="h-3 w-20 rounded bg-muted mb-8" />
          <div className="h-3 w-32 rounded bg-muted mb-4" />
          <div className="h-10 w-4/5 rounded bg-muted mb-3" />
          <div className="h-10 w-3/5 rounded bg-muted mb-6" />
          <div className="h-3 w-48 rounded bg-muted mb-10" />
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/5 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (dbPost) {
    const paragraphs = dbPost.content.split("\n\n").filter(p => p.trim());
    const formattedDate = new Date(dbPost.created_at).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric"
    });

    return (
      <div className="min-h-screen">
        {/* Highsnobiety-style article header */}
        <div className="border-b border-border/30">
          <div className="container max-w-2xl py-10 md:py-16">
            <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> Editorial
            </Link>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{dbPost.category}</span>
              <h1 className="mt-3 font-display text-3xl font-black leading-[1.1] md:text-5xl">{dbPost.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{dbPost.excerpt}</p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border/30 pt-5">
              <div>
                <p className="text-sm font-semibold">{dbPost.author}</p>
                <p className="text-xs text-muted-foreground">{formattedDate} · {dbPost.read_time} min read</p>
              </div>
            </div>
          </div>
        </div>

        {/* Article body — clean, text-first like Highsnobiety */}
        <article className="container max-w-2xl py-10">
          <div className="prose prose-invert max-w-none">
            {paragraphs.map((para, i) => (
              <div key={i}>
                <p className={`leading-[1.8] text-muted-foreground ${i === 0 ? "text-lg font-medium" : ""}`}>
                  {para}
                </p>

                {/* Product cards after every 2nd paragraph */}
                {i > 0 && i % 2 === 1 && inlineProducts[Math.floor(i / 2)] && (
                  <div className="my-10 border-y border-border/30 py-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shop the Story</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {inlineProducts.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2).map(product => (
                        <Link key={product.id} to={`/product/${product.id}`} className="group block overflow-hidden rounded no-underline">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {product.brandId === "17" && (
                              <div className="absolute top-0 left-0 right-0 bg-accent px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wider text-black">
                                GET 10% OFF WITH CODE DRIPWAYAPPAREL
                              </div>
                            )}
                          </div>
                          <div className="mt-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{product.brandName}</p>
                            <p className="mt-0.5 text-sm font-semibold text-foreground">{product.name}</p>
                            <p className="mt-0.5 text-sm font-bold text-accent">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      </div>
    );
  }

  if (staticPost) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border/30">
          <div className="container max-w-2xl py-10 md:py-16">
            <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> Editorial
            </Link>
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{staticPost.category}</span>
              <h1 className="mt-3 font-display text-3xl font-black leading-[1.1] md:text-5xl">{staticPost.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{staticPost.excerpt}</p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-border/30 pt-5">
              <div>
                <p className="text-sm font-semibold">{staticPost.author}</p>
                <p className="text-xs text-muted-foreground">{staticPost.date} · {staticPost.readTime} min read</p>
              </div>
            </div>
          </div>
        </div>
        <article className="container max-w-2xl py-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-[1.8] text-muted-foreground">{staticPost.excerpt}</p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="container py-20 text-center">
      <p className="text-lg">Article not found.</p>
      <Link to="/blog" className="mt-4 text-sm text-accent hover:underline">← Back to Editorial</Link>
    </div>
  );
}
