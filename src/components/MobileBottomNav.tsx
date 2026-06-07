import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, LayoutGrid } from "lucide-react";
import { useState } from "react";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/collections", label: "Shop", icon: LayoutGrid, match: (p: string) => p.startsWith("/collections") || p.startsWith("/shop") || p.startsWith("/brands") || p.startsWith("/brand/") },
  { to: "/collections?focus=search", label: "Search", icon: Search, match: () => false },
  { to: "/wishlist", label: "Saved", icon: Heart, match: (p: string) => p.startsWith("/wishlist") },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  // Hide on admin and auth screens where the bottom bar interferes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav
        aria-label="Primary mobile"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 py-1.5">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <li key={item.to} className="flex">
                <Link
                  to={item.to}
                  className={`flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    active ? "text-accent" : "text-muted-foreground active:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "stroke-[2.2]" : ""}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex">
            <button
              onClick={() => { if (!user) setAuthOpen(true); }}
              className={`flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                user ? "text-foreground" : "text-muted-foreground active:text-foreground"
              }`}
            >
              <User className="h-5 w-5" />
              {user ? "You" : "Sign in"}
            </button>
          </li>
        </ul>
      </nav>
      {/* Spacer so fixed bar doesn't cover content */}
      <div className="h-16 md:hidden" aria-hidden />
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}