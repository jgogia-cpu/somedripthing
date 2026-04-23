import { Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

interface InstagramCTAProps {
  handle: string; // e.g. "@dripwayapparel"
  followers?: number;
  label?: string; // section label, defaults to "On The Gram"
  heading?: string; // big heading override
  trackingProperties?: Record<string, string | number | boolean | null | undefined>;
}

export default function InstagramCTA({
  handle,
  followers,
  label = "On The Gram",
  heading,
  trackingProperties,
}: InstagramCTAProps) {
  const cleanHandle = handle.replace("@", "");
  const url = `https://instagram.com/${cleanHandle}`;
  const displayHeading = heading || `Follow @${cleanHandle}`;

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
          {label}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-3xl"
        >
          <TrackedOutboundLink
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            trackingProperties={{
              click_type: "instagram",
              instagram_handle: handle,
              source: "instagram_cta",
              ...trackingProperties,
            }}
            className="group relative block overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-card/80 p-10 backdrop-blur-sm transition-all hover:border-accent/50 md:p-14"
          >
            {/* Decorative gradient orb */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 blur-3xl transition-opacity group-hover:opacity-80" />

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 shadow-lg">
                <Instagram className="h-8 w-8 text-white" />
              </div>

              <h3 className="mt-6 font-display text-3xl font-bold md:text-5xl">
                {displayHeading}
              </h3>

              <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
                Drops, fits, behind-the-scenes. The good stuff lives on the gram.
              </p>

              {typeof followers === "number" && followers > 0 && (
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                  {(followers / 1000).toFixed(followers >= 10000 ? 0 : 1)}K followers
                </p>
              )}

              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-transform group-hover:scale-105">
                Open Instagram
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </TrackedOutboundLink>
        </motion.div>
      </div>
    </section>
  );
}
