import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { usePostHog } from "posthog-js/react";
import { trackPageview } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index"; // keep home eager for fast LCP
const BrandProfile = lazy(() => import("./pages/BrandProfile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Category = lazy(() => import("./pages/Category"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Collections = lazy(() => import("./pages/Collections"));
const Brands = lazy(() => import("./pages/Brands"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminSEO = lazy(() => import("./pages/AdminSEO"));
const AdminAffiliate = lazy(() => import("./pages/AdminAffiliate"));
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use smooth scroll when user hasn't requested reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
  }, [pathname]);
  return null;
}

function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
    if (!posthog.__loaded) {
      return;
    }

    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [location, posthog]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          {/* /explore was removed — redirect to /collections to preserve any existing links */}
          <Route path="/explore" element={<Navigate to="/collections" replace />} />
          <Route path="/explore/*" element={<Navigate to="/collections" replace />} />
          <Route path="/brand/:slug" element={<BrandProfile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:gender/:subcategory" element={<Category />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/admin/seo" element={<AdminSEO />} />
          <Route path="/admin/affiliate" element={<AdminAffiliate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <WishlistProvider>
    <CurrencyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PostHogPageView />
        <div className="bg-accent text-center py-1.5 px-4">
          <TrackedOutboundLink
            href="https://dripbyrage.com/dripwayapparel"
            target="_blank"
            rel="noopener noreferrer"
            trackingProperties={{
              brand_id: "17",
              brand_name: "Drip by Rage",
              brand_slug: "drip-by-rage",
              click_type: "promo",
              source: "top_promo_banner",
            }}
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
          >
            GET 10% OFF DRIPBYRAGE WITH CODE DRIPWAYAPPAREL
          </TrackedOutboundLink>
        </div>
        <Navbar />
        <main>
        <Suspense fallback={<div className="container py-20 text-center text-sm text-muted-foreground">Loading…</div>}>
        <AnimatedRoutes />
        </Suspense>
        </main>
        <Footer />
        <MobileBottomNav />
      </BrowserRouter>
    </TooltipProvider>
    </CurrencyProvider>
    </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
