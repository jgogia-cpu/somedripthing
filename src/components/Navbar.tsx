import { useState, FormEvent, useMemo, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Menu, X, ChevronDown, User, LogOut, Home, Mail, BookOpen, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CurrencySelector from "@/components/CurrencySelector";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { brands, products } from "@/data/brands";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SUBCATEGORIES = [
  { slug: "hoodies", label: "Hoodies" },
  { slug: "shirts", label: "Shirts" },
  { slug: "sweaters", label: "Sweaters" },
  { slug: "denim", label: "Denim" },
  { slug: "bottoms", label: "Bottoms" },
  { slug: "jackets", label: "Jackets" },
  { slug: "kicks", label: "Kicks" },
  { slug: "accessories", label: "Accessories" },
];

function NavItem({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      className={`group relative px-3 py-1.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-secondary/0 transition-all duration-300 group-hover:bg-secondary/80" />
      <span className="relative">{label}</span>
      {isActive && (
        <motion.span
          layoutId="nav-active"
          className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

function ShopMenu() {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex items-center gap-1 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:text-foreground focus:outline-none">
          <span className="absolute inset-0 rounded-full bg-secondary/0 transition-all duration-300 group-hover:bg-secondary/80" />
          <span className="relative">Shop</span>
          <ChevronDown className={`relative h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className="w-[28rem] rounded-2xl border-border/50 bg-card/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 gap-4">
          {(["him", "her"] as const).map((gender) => (
            <div key={gender}>
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                {gender === "him" ? "Him" : "Her"}
              </div>
              <div className="flex flex-col">
                {SUBCATEGORIES.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/shop/${gender}/${sub.slug}`}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/10 hover:text-foreground"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const CATEGORY_SUGGESTIONS = [
  { label: "Hoodies", to: "/shop/him/hoodies" },
  { label: "Sweaters", to: "/shop/him/sweaters" },
  { label: "Denim", to: "/shop/him/denim" },
  { label: "Jackets", to: "/shop/him/jackets" },
  { label: "Kicks", to: "/shop/him/kicks" },
  { label: "Accessories", to: "/shop/him/accessories" },
];

function SearchBar({ onSubmit, autoFocus = false }: { onSubmit?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return null;
    const brandHits = brands
      .filter((b) => b.name.toLowerCase().includes(term) || b.aesthetics.some((a) => a.toLowerCase().includes(term)))
      .slice(0, 4)
      .map((b) => ({ kind: "brand" as const, id: b.id, label: b.name, sub: b.aesthetics.slice(0, 2).join(" · "), to: `/brand/${b.slug}`, image: b.logo }));
    const categoryHits = CATEGORY_SUGGESTIONS.filter((c) => c.label.toLowerCase().includes(term))
      .slice(0, 3)
      .map((c) => ({ kind: "category" as const, id: c.to, label: c.label, sub: "Category", to: c.to, image: undefined }));
    const productHits = products
      .filter((p) => p.name.toLowerCase().includes(term) || p.brandName.toLowerCase().includes(term))
      .slice(0, 5)
      .map((p) => ({ kind: "product" as const, id: p.id, label: p.name, sub: p.brandName, to: `/product/${p.id}`, image: p.image }));
    return { brandHits, categoryHits, productHits };
  }, [q]);

  const flat = useMemo(() => {
    if (!suggestions) return [];
    return [
      ...suggestions.brandHits,
      ...suggestions.categoryHits,
      ...suggestions.productHits,
    ];
  }, [suggestions]);

  useEffect(() => { setHighlight(0); }, [q]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setQ("");
    setOpen(false);
    onSubmit?.();
  };

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    if (flat.length && highlight >= 0 && highlight < flat.length) {
      go(flat[highlight].to);
      return;
    }
    go(`/collections?q=${encodeURIComponent(term)}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !flat.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => (h + 1) % flat.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => (h - 1 + flat.length) % flat.length); }
    if (e.key === "Escape") setOpen(false);
  };

  const showDropdown = open && q.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full md:w-64">
      <form onSubmit={handle} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search brands, drops…"
          className="h-9 w-full rounded-full border border-border/60 bg-secondary/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors"
        />
      </form>
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border/60 bg-popover/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            {flat.length === 0 ? (
              <button
                onClick={() => go(`/collections?q=${encodeURIComponent(q.trim())}`)}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              >
                Search "<span className="font-medium text-foreground">{q.trim()}</span>" everywhere →
              </button>
            ) : (
              <>
                {suggestions?.brandHits.length ? <SectionLabel>Brands</SectionLabel> : null}
                {suggestions?.brandHits.map((s, idx) => (
                  <SuggestionItem key={"b" + s.id} item={s} active={highlight === idx} onSelect={() => go(s.to)} onHover={() => setHighlight(idx)} />
                ))}
                {suggestions?.categoryHits.length ? <SectionLabel>Categories</SectionLabel> : null}
                {suggestions?.categoryHits.map((s, i) => {
                  const idx = (suggestions.brandHits.length) + i;
                  return <SuggestionItem key={"c" + s.id} item={s} active={highlight === idx} onSelect={() => go(s.to)} onHover={() => setHighlight(idx)} />;
                })}
                {suggestions?.productHits.length ? <SectionLabel>Products</SectionLabel> : null}
                {suggestions?.productHits.map((s, i) => {
                  const idx = (suggestions.brandHits.length) + (suggestions.categoryHits.length) + i;
                  return <SuggestionItem key={"p" + s.id} item={s} active={highlight === idx} onSelect={() => go(s.to)} onHover={() => setHighlight(idx)} />;
                })}
                <button
                  onClick={() => go(`/collections?q=${encodeURIComponent(q.trim())}`)}
                  className="mt-1 w-full rounded-lg border-t border-border/40 px-3 py-2.5 text-left text-xs font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  See all results for "{q.trim()}" →
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1 px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 first:mt-0 first:pt-1">
      {children}
    </div>
  );
}

function SuggestionItem({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: { label: string; sub: string; image?: string; kind?: "brand" | "category" | "product" };
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
        active ? "bg-accent/15 text-foreground" : "text-foreground/90 hover:bg-accent/10"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary/80">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className={
              item.kind === "brand"
                ? "h-full w-full object-contain p-1"
                : "h-full w-full object-cover"
            }
          />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{item.sub}</p>
      </div>
    </button>
  );
}

const TOP_LINKS = [
  { to: "/brands", label: "Brands" },
  { to: "/collections", label: "Collections" },
];

function MobileSubcatList({ gender, onNavigate }: { gender: "him" | "her"; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60"
      >
        Shop {gender === "him" ? "Him" : "Her"}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
            {SUBCATEGORIES.map((sub) => (
              <Link
                key={sub.slug}
                to={`/shop/${gender}/${sub.slug}`}
                onClick={onNavigate}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 liquid-glass !rounded-none border-x-0 border-t-0">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="group text-xl font-bold tracking-tight transition-opacity hover:opacity-80" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          DRIPWAY
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            aria-label="Home"
            className={`group relative flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:bg-secondary hover:scale-105 ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Home className="h-4 w-4" />
          </Link>
          <ShopMenu />
          {TOP_LINKS.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} isActive={location.pathname === link.to} />
          ))}
        </div>

        {/* Search (desktop) */}
        <div className="ml-auto hidden flex-1 justify-end md:flex md:max-w-xs">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <CurrencySelector />
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="rounded-full transition-all duration-200 hover:bg-secondary hover:scale-105">
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full transition-all duration-200 hover:bg-secondary hover:scale-105">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border/50 bg-card/95 backdrop-blur-xl">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/affiliate" className="text-accent">Affiliate program</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="gap-2">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all duration-200 hover:bg-secondary hover:scale-105"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  navigate(`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                } else {
                  setAuthOpen(true);
                }
              }}
            >
              <User className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-border/40 md:hidden"
          >
            <div className="container flex flex-col gap-1 py-5">
              <div className="pb-2">
                <SearchBar onSubmit={closeMobile} />
              </div>
              <MobileSubcatList gender="him" onNavigate={closeMobile} />
              <MobileSubcatList gender="her" onNavigate={closeMobile} />
              <Link to="/brands" onClick={closeMobile} className="rounded-lg px-3 py-3.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60">
                Brands
              </Link>
              <Link to="/collections" onClick={closeMobile} className="rounded-lg px-3 py-3.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60">
                Collections
              </Link>
              <Link to="/blog" onClick={closeMobile} className="rounded-lg px-3 py-3.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60">
                Blog
              </Link>
              <Link to="/affiliate" onClick={closeMobile} className="rounded-lg px-3 py-3.5 font-display text-lg font-bold text-accent transition-colors hover:bg-secondary/60">
                Affiliate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
}
