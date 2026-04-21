import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import BrandProfile from "./pages/BrandProfile";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Wishlist from "./pages/Wishlist";
import Collections from "./pages/Collections";
import Affiliate from "./pages/Affiliate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog.__loaded) {
      return;
    }

    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [location, posthog]);

  return null;
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
          <a href="https://dripbyrage.com/dripwayapparel" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-black hover:underline">
            GET 10% OFF DRIPBYRAGE WITH CODE DRIPWAYAPPAREL
          </a>
        </div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/brand/:slug" element={<BrandProfile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:gender/:subcategory" element={<Category />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
    </CurrencyProvider>
    </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
