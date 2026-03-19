import { Link } from "react-router-dom";
import { Instagram, ArrowUpRight } from "lucide-react";
import dripwayLogo from "@/assets/dripway-logo.jpg";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/20 py-16">
      <div className="container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="group flex items-center">
              <img src={dripwayLogo} alt="DRIPWAY" className="h-5 transition-opacity group-hover:opacity-80" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Discover the brands Instagram won't show you.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Discover</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/explore">All Brands</FooterLink>
              <FooterLink to="/collections">Collections</FooterLink>
              <FooterLink to="/shop/him/hoodies">Shop Him</FooterLink>
              <FooterLink to="/shop/her/hoodies">Shop Her</FooterLink>
              <FooterLink to="/explore?aesthetic=Streetwear">Streetwear</FooterLink>
              <FooterLink to="/explore?aesthetic=Minimalist">Minimalist</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Company</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <FooterLink to="/blog">Editorial</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/submit">Submit a Brand</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="group flex items-center justify-center rounded-full border border-border/50 p-2.5 text-muted-foreground transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-accent">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-border/30 pt-6 text-center text-xs text-muted-foreground/60">
          © 2026 DRIPWAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group flex items-center gap-1 text-muted-foreground transition-all duration-200 hover:text-foreground hover:translate-x-0.5">
      {children}
      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-50" />
    </Link>
  );
}
