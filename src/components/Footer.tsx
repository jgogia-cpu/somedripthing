import { Link } from "react-router-dom";
import { Instagram, ArrowUpRight, Mail } from "lucide-react";
import dripwayLogo from "@/assets/dripway-logo.jpg";
import { brands } from "@/data/brands";
import { useMemo } from "react";

/**
 * Editorial footer: oversized wordmark, anchored newsletter, brand index
 * pulled from the actual brands array so it stays in sync.
 */
export default function Footer() {
  const featured = useMemo(
    () => brands.filter((b) => b.featured).slice(0, 10),
    []
  );

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border/40 bg-secondary/15">
      <div className="container py-16">
        {/* Top: tagline + newsletter */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src={dripwayLogo} alt="DRIPWAY" className="h-6 opacity-90" />
            </Link>
            <p
              className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight md:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Discover the brands Instagram won't show you.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A curated index of independent fashion labels. New drops, weekly heat check, no algorithmic noise.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-md">
            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              <Mail className="h-3 w-3" /> Weekly heat, in your inbox
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              The Monday edit — one email, the freshest drops we co-signed this week.
            </p>
            <form
              action="#"
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2"
            >
              <input
                type="email"
                placeholder="you@something.com"
                className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="rounded-full bg-accent px-5 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Middle: brand grid */}
        <div className="mt-14 border-t border-border/40 pt-10">
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Featured Brands
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
            {featured.map((b) => (
              <FooterLink key={b.id} to={`/brand/${b.slug}`}>{b.name}</FooterLink>
            ))}
          </div>
        </div>

        {/* Bottom: link columns */}
        <div className="mt-14 grid gap-10 border-t border-border/40 pt-10 sm:grid-cols-2 md:grid-cols-4">
          <FooterColumn title="Shop">
            <FooterLink to="/brands">All Brands</FooterLink>
            <FooterLink to="/collections">Heat Check</FooterLink>
            <FooterLink to="/shop/him/hoodies">Shop Him</FooterLink>
            <FooterLink to="/shop/her/hoodies">Shop Her</FooterLink>
          </FooterColumn>
          <FooterColumn title="Read">
            <FooterLink to="/blog">Editorial</FooterLink>
            <FooterLink to="/wishlist">Wishlist</FooterLink>
          </FooterColumn>
          <FooterColumn title="Brands">
            <FooterLink to="/affiliate">Apply to be listed</FooterLink>
            <FooterLink to="/affiliate">Affiliate program</FooterLink>
          </FooterColumn>
          <FooterColumn title="Connect">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="h-4 w-4" /> Instagram
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
            </a>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/30 pt-6 text-xs text-muted-foreground/60 sm:flex-row">
          <span>© 2026 DRIPWAY. All rights reserved.</span>
          <span className="opacity-70">Built for the discerning. Curated weekly.</span>
        </div>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[18vw] font-black leading-none tracking-tighter text-foreground/[0.025]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        DRIPWAY
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</h4>
      <div className="flex flex-col gap-2.5 text-sm">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5">
      <span className="truncate">{children}</span>
      <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-50" />
    </Link>
  );
}
