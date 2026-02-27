import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/brands";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg">Article not found.</p>
        <Link to="/blog" className="mt-4 text-sm text-accent hover:underline">← Back to Editorial</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <article className="container max-w-3xl">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Editorial
        </Link>
        <span className="block text-xs font-semibold uppercase tracking-widest text-accent">{post.category}</span>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-muted-foreground">By {post.author} · {post.date} · {post.readTime} min read</p>

        <div className="mt-8 overflow-hidden rounded-xl">
          <img src={post.coverImage} alt={post.title} className="aspect-[16/9] w-full object-cover" />
        </div>

        <div className="prose mt-10 max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            This is a preview of the full article. In a production environment, this content would be loaded from a CMS or database, supporting rich formatting, embedded images, and interactive elements.
          </p>
        </div>
      </article>
    </div>
  );
}
