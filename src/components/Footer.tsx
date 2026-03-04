import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import dripwayLogo from "@/assets/dripway-logo.jpg";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30 py-16">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center">
              <img src={dripwayLogo} alt="DRIPWAY" className="h-5" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Discover the brands Instagram won't show you.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">Discover</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/explore" className="hover:text-foreground transition-colors">All Brands</Link>
              <Link to="/collections" className="hover:text-foreground transition-colors">Collections</Link>
              <Link to="/shop/him/hoodies" className="hover:text-foreground transition-colors">Shop Him</Link>
              <Link to="/shop/her/hoodies" className="hover:text-foreground transition-colors">Shop Her</Link>
              <Link to="/explore?aesthetic=Streetwear" className="hover:text-foreground transition-colors">Streetwear</Link>
              <Link to="/explore?aesthetic=Minimalist" className="hover:text-foreground transition-colors">Minimalist</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/blog" className="hover:text-foreground transition-colors">Editorial</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/submit" className="hover:text-foreground transition-colors">Submit a Brand</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2026 DRIPWAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
