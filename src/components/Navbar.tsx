import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CurrencySelector from "@/components/CurrencySelector";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import dripwayLogo from "@/assets/dripway-logo.jpg";
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

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/collections", label: "Collections" },
];

function NavItem({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  if (serif) {
    return (
      <Link
        to={to}
        className="group relative rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg hover:shadow-accent/20"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`group relative px-3 py-1.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {/* Hover background pill */}
      <span className="absolute inset-0 rounded-full bg-secondary/0 transition-all duration-300 group-hover:bg-secondary/80" />
      <span className="relative">{label}</span>
      {/* Active indicator */}
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

function GenderDropdown({ gender, label }: { gender: string; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={`group relative flex items-center gap-1 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:text-foreground`}>
        <span className="absolute inset-0 rounded-full bg-secondary/0 transition-all duration-300 group-hover:bg-secondary/80" />
        <span className="relative">{label}</span>
        <ChevronDown className={`relative h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 rounded-xl border border-border/50 bg-card/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm border-l border-t border-border/50 bg-card/95" />
            {SUBCATEGORIES.map(sub => (
              <Link
                key={sub.slug}
                to={`/shop/${gender}/${sub.slug}`}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:text-foreground hover:pl-4"
                onClick={() => setOpen(false)}
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
  const [mobileHimOpen, setMobileHimOpen] = useState(false);
  const [mobileHerOpen, setMobileHerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group text-xl font-bold tracking-tight transition-opacity hover:opacity-80" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          DRIPWAY
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <NavItem
              key={link.to}
              to={link.to}
              label={link.label}
              isActive={location.pathname === link.to}
              serif={link.serif}
            />
          ))}
          <GenderDropdown gender="him" label="Him" />
          <GenderDropdown gender="her" label="Her" />
          <NavItem to="/blog" label="Blog" isActive={location.pathname === "/blog"} />
        </div>

        <div className="flex items-center gap-1">
          <CurrencySelector />
          <Link to="/affiliate">
            <Button variant="outline" size="sm" className="hidden rounded-full border-accent/50 px-3 text-xs font-bold uppercase tracking-wider text-accent hover:bg-accent hover:text-accent-foreground md:inline-flex">
              Affiliate
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="ghost" size="icon" className="rounded-full transition-all duration-200 hover:bg-secondary hover:scale-105">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
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
                <DropdownMenuItem onClick={() => signOut()} className="gap-2">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full transition-all duration-200 hover:bg-secondary hover:scale-105" onClick={() => setAuthOpen(true)}>
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
            <div className="container flex flex-col gap-1 py-6">
              {/* HIM mobile */}
              <button
                onClick={() => setMobileHimOpen(!mobileHimOpen)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60"
              >
                Him <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileHimOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileHimOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
                    {SUBCATEGORIES.map(sub => (
                      <Link key={sub.slug} to={`/shop/him/${sub.slug}`} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground">
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HER mobile */}
              <button
                onClick={() => setMobileHerOpen(!mobileHerOpen)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 font-display text-lg font-semibold uppercase transition-colors hover:bg-secondary/60"
              >
                Her <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileHerOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileHerOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
                    {SUBCATEGORIES.map(sub => (
                      <Link key={sub.slug} to={`/shop/her/${sub.slug}`} onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground">
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-display text-lg font-medium transition-colors hover:bg-secondary/60"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 font-display text-lg font-medium transition-colors hover:bg-secondary/60">
                Blog
              </Link>
              <Link to="/affiliate" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 font-display text-lg font-bold text-accent transition-colors hover:bg-secondary/60">
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
