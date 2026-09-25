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
    <section className="border-b border-border py-16 md:py-24">
      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-border pt-3 text-left text-[10px] font-bold uppercase tracking-[0.3em] text-accent"
        >
          {label}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
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
            className="group relative block overflow-hidden border-y border-border bg-card p-8 transition-colors hover:bg-secondary md:p-14"
          >
            <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
              <div className="flex h-16 w-16 items-center justify-center border border-border md:col-span-1">
                <Instagram className="h-8 w-8 text-accent" />
              </div>
              <div className="md:col-span-7">
              <h3 className="font-display text-4xl font-bold md:text-6xl">
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

              </div>
              <div className="inline-flex items-center justify-center gap-2 border border-foreground px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition-colors group-hover:bg-foreground group-hover:text-background md:col-span-3 md:col-start-10">
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
