import { Link } from "react-router-dom";
import { brands } from "@/data/brands";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Editorial footer: oversized wordmark, anchored newsletter, brand index
 * pulled from the actual brands array so it stays in sync.
 */
export default function Footer() {
  const featured = useMemo(
    () => brands.filter((b) => b.featured).slice(0, 10),
    []
  );
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email: value, source: "footer", unsubscribed_at: null }, { onConflict: "email" });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't subscribe", description: error.message, variant: "destructive" });
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast({ title: "You're on the list 🔥", description: "Monday Heat Check incoming." });
  };

  return (
    <footer className="mt-24 border-t border-border">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-5xl leading-none md:text-7xl">DRIPWAY</Link>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">An index of independent fashion labels.</p>
            {subscribed ? (
              <p className="mt-8 text-sm">You're on the list.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-8 flex max-w-sm border-b border-foreground/40">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for the Monday edit" aria-label="Email address" className="h-11 flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none" />
                <button type="submit" disabled={loading} className="text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50">{loading ? "…" : "Join"}</button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-7">
            <FooterColumn title="Shop">
              <FooterLink to="/brands">All brands</FooterLink>
              <FooterLink to="/collections">Heat Check</FooterLink>
              <FooterLink to="/shop/him/hoodies">Him</FooterLink>
              <FooterLink to="/shop/her/hoodies">Her</FooterLink>
            </FooterColumn>
            <FooterColumn title="Read">
              <FooterLink to="/blog">Editorial</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/wishlist">Wishlist</FooterLink>
            </FooterColumn>
            <FooterColumn title="Brands">
              <FooterLink to="/forbrands">For brands</FooterLink>
              <FooterLink to="/forbrands">Submit a brand</FooterLink>
            </FooterColumn>
            <FooterColumn title="Featured">
              {featured.slice(0, 5).map((b) => <FooterLink key={b.id} to={`/brand/${b.slug}`}>{b.name}</FooterLink>)}
            </FooterColumn>
          </div>
        </div>
        <div className="mt-16 flex justify-between border-t border-border pt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>© 2026 DRIPWAY</span><span>Curated weekly</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{title}</h4>
      <div className="flex flex-col gap-2.5 text-sm">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5">
      <span className="truncate">{children}</span>
    </Link>
  );
}
