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

  // Pick random-ish products seeded by slug for consistency
  const inlineProducts = useMemo(() => {
    if (!slug) return [];
    let seed = 0;
    for (let i = 0; i < slug.length; i++) seed = ((seed << 5) - seed + slug.charCodeAt(i)) | 0;
    const shuffled = [...products].sort((a, b) => {
      const ha = ((seed + a.id.charCodeAt(1)) * 2654435761) >>> 0;
      const hb = ((seed + b.id.charCodeAt(1)) * 2654435761) >>> 0;
      return ha - hb;
    });
    return shuffled.slice(0, 5);
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

  // Check static posts as fallback
  const staticPost = staticBlogPosts.find(p => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-3xl animate-pulse">
          <div className="h-4 w-24 rounded bg-muted mb-6" />
          <div className="h-8 w-3/4 rounded bg-muted mb-4" />
          <div className="h-4 w-1/2 rounded bg-muted mb-8" />
          <div className="aspect-[16/9] rounded-xl bg-muted mb-10" />
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

    return (
      <div className="min-h-screen py-8">
        <article className="container max-w-3xl">
          <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Editorial
          </Link>
          <span className="block text-xs font-semibold uppercase tracking-widest text-accent">{dbPost.category}</span>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{dbPost.title}</h1>
          <p className="mt-4 text-muted-foreground">By {dbPost.author} · {new Date(dbPost.created_at).toLocaleDateString()} · {dbPost.read_time} min read</p>

          {dbPost.cover_image_url && (
            <div className="mt-8 overflow-hidden rounded-xl">
              <img src={dbPost.cover_image_url} alt={dbPost.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert mt-10 max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground font-medium">{dbPost.excerpt}</p>
            {paragraphs.map((para, i) => (
              <div key={i}>
                <p className="mt-6 leading-relaxed text-muted-foreground">{para}</p>
                {/* Insert product pair after every 2nd paragraph */}
                {i > 0 && i % 2 === 1 && inlineProducts[Math.floor(i / 2)] && (
                  <div className="my-8 grid gap-4 sm:grid-cols-2">
                    {inlineProducts.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2).map(product => (
                      <Link key={product.id} to={`/product/${product.id}`} className="group block overflow-hidden rounded-xl bg-secondary/50 no-underline">
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
                        <div className="p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{product.brandName}</p>
                          <p className="mt-0.5 text-sm font-semibold text-foreground">{product.name}</p>
                          <p className="mt-0.5 text-sm font-bold text-accent">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
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
      <div className="min-h-screen py-8">
        <article className="container max-w-3xl">
          <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Editorial
          </Link>
          <span className="block text-xs font-semibold uppercase tracking-widest text-accent">{staticPost.category}</span>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{staticPost.title}</h1>
          <p className="mt-4 text-muted-foreground">By {staticPost.author} · {staticPost.date} · {staticPost.readTime} min read</p>

          <div className="mt-8 overflow-hidden rounded-xl">
            <img src={staticPost.coverImage} alt={staticPost.title} className="aspect-[16/9] w-full object-cover" />
          </div>

          <div className="prose prose-invert mt-10 max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">{staticPost.excerpt}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This is a preview of the full article. In a production environment, this content would be loaded from a CMS or database, supporting rich formatting, embedded images, and interactive elements.
            </p>
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
