// Generates public/sitemap.xml at predev / prebuild time.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://thedripway.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

async function loadBrandsAndProducts(): Promise<Entry[]> {
  const mod = await import("../src/data/brands.ts");
  const brands = (mod as any).brands ?? [];
  const products = (mod as any).products ?? [];
  return [
    ...brands.map((b: any) => ({ path: `/brand/${b.slug}`, changefreq: "weekly", priority: "0.7" })),
    ...products.map((p: any) => ({ path: `/product/${p.id}`, changefreq: "weekly", priority: "0.6" })),
  ];
}

async function loadBlogPosts(): Promise<Entry[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,created_at&published=eq.true&order=created_at.desc&limit=500`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string; created_at: string }>;
    return rows.map((r) => ({
      path: `/blog/${r.slug}`,
      lastmod: r.created_at.slice(0, 10),
      changefreq: "monthly",
      priority: "0.5",
    }));
  } catch {
    return [];
  }
}

function toXml(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        "  <url>",
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const staticEntries: Entry[] = [
    { path: "/", changefreq: "daily", priority: "1.0", lastmod: today },
    { path: "/explore", changefreq: "daily", priority: "0.9" },
    { path: "/collections", changefreq: "weekly", priority: "0.8" },
    { path: "/blog", changefreq: "daily", priority: "0.8" },
    { path: "/affiliate", changefreq: "monthly", priority: "0.4" },
  ];
  const [brandsProducts, blog] = await Promise.all([loadBrandsAndProducts(), loadBlogPosts()]);
  const entries = [...staticEntries, ...brandsProducts, ...blog];
  writeFileSync(resolve("public/sitemap.xml"), toXml(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();