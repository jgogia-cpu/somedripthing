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
  { to: "/collections", label: "Collections", serif: true },
];

function GenderDropdown({ gender, label }: { gender: string; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-44 rounded-xl border bg-card p-2 shadow-xl"
          >
            {SUBCATEGORIES.map(sub => (
              <Link
                key={sub.slug}
                to={`/shop/${gender}/${sub.slug}`}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          DRIPWAY
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                link.serif
                  ? "rounded-full bg-primary px-3 py-1 text-primary-foreground hover:opacity-90 hover:text-primary-foreground"
                  : location.pathname === link.to ? "text-foreground" : "text-muted-foreground"
              }`}
              style={link.serif ? { fontFamily: "'Playfair Display', serif", fontWeight: 700 } : undefined}
            >
              {link.label}
            </Link>
          ))}
          <GenderDropdown gender="him" label="Him" />
          <GenderDropdown gender="her" label="Her" />
          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              location.pathname === "/blog" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector />
          <Link to="/explore">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="gap-2">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setAuthOpen(true)}>
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
            className="overflow-hidden border-t md:hidden"
          >
            <div className="container flex flex-col gap-2 py-6">
              {/* HIM mobile */}
              <button
                onClick={() => setMobileHimOpen(!mobileHimOpen)}
                className="flex items-center justify-between font-display text-lg font-semibold uppercase"
              >
                Him <ChevronDown className={`h-4 w-4 transition-transform ${mobileHimOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileHimOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
                    {SUBCATEGORIES.map(sub => (
                      <Link key={sub.slug} to={`/shop/him/${sub.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-muted-foreground">
                        {sub.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HER mobile */}
              <button
                onClick={() => setMobileHerOpen(!mobileHerOpen)}
                className="flex items-center justify-between font-display text-lg font-semibold uppercase"
              >
                Her <ChevronDown className={`h-4 w-4 transition-transform ${mobileHerOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileHerOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
                    {SUBCATEGORIES.map(sub => (
                      <Link key={sub.slug} to={`/shop/her/${sub.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-muted-foreground">
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
                  className="font-display text-lg font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
}
