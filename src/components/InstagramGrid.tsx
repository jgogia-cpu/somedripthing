import { Instagram, ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import type { Product } from "@/data/brands";

interface InstagramGridProps {
  handle: string;
  brandName: string;
  brandId: string;
  brandSlug: string;
  products: Product[];
}

export default function InstagramGrid({ handle, brandName, brandId, brandSlug, products }: InstagramGridProps) {
  const cleanHandle = handle.replace("@", "");
  const profileUrl = `https://instagram.com/${cleanHandle}`;

  // pull up to 9 distinct images from the brand's products as IG-style tiles
  const tiles: { src: string; productId: string }[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const imgs = (p.images && p.images.length ? p.images : [{ url: p.image }]) as Array<{ url?: string } | string>;
    for (const i of imgs) {
      const src = typeof i === "string" ? i : i?.url;
      if (src && !seen.has(src)) {
        seen.add(src);
        tiles.push({ src, productId: p.id });
      }
      if (tiles.length >= 9) break;
    }
    if (tiles.length >= 9) break;
  }

  if (tiles.length === 0) return null;

  const tracking = {
    brand_id: brandId,
    brand_name: brandName,
    brand_slug: brandSlug,
    click_type: "instagram",
    instagram_handle: handle,
    source: "brand_profile_instagram_grid",
  };

  return (
    <section className="border-t border-border/40 py-16 md:py-24">
      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-xs font-bold uppercase tracking-[0.2em] text-accent"
        >
          On The Gram
        </motion.p>

        <div className="mx-auto mt-6 mb-10 flex flex-col items-center gap-3">
          <TrackedOutboundLink
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            trackingProperties={tracking}
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 shadow-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display text-lg font-bold leading-tight group-hover:text-accent transition-colors">
                @{cleanHandle}
              </p>
              <p className="text-xs text-muted-foreground">Tap any tile to visit Instagram</p>
            </div>
          </TrackedOutboundLink>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-1 sm:gap-2">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.src + i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
            >
              <TrackedOutboundLink
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                trackingProperties={{ ...tracking, tile_index: i }}
                className="group relative block aspect-square overflow-hidden rounded-sm bg-muted"
              >
                <img
                  src={tile.src}
                  alt={`${brandName} on Instagram`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1 text-sm font-semibold text-white">
                    <Heart className="h-4 w-4 fill-white" />
                    {Math.floor(120 + Math.random() * 900)}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-white">
                    <MessageCircle className="h-4 w-4 fill-white" />
                    {Math.floor(5 + Math.random() * 40)}
                  </span>
                </div>
              </TrackedOutboundLink>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <TrackedOutboundLink
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            trackingProperties={tracking}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            View Full Profile
            <ArrowUpRight className="h-4 w-4" />
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}