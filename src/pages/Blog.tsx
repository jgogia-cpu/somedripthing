import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/brands";

export default function Blog() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <h1 className="mb-2 font-display text-3xl font-bold">Editorial</h1>
        <p className="mb-10 text-muted-foreground">Brand spotlights, trend reports, and style guides.</p>

        {/* Featured */}
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

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-lg">
                  <img src={post.coverImage} alt={post.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">{post.category}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{post.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{post.readTime} min read</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
