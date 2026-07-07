import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById } from "@/data/brands";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/AuthDialog";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [authOpen, setAuthOpen] = useState(false);

  const wishlistProducts = wishlist.map(id => getProductById(id)).filter(Boolean);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container max-w-md text-center">
          <div className="relative mx-auto inline-flex">
            <Heart className="h-16 w-16 text-accent/80" strokeWidth={1.2} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">Build your wishlist.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Save the pieces you're eyeing. Sync across devices. Get notified when prices drop.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="gap-2 rounded-full"
              size="lg"
              onClick={() => setAuthOpen(true)}
            >
              <LogIn className="h-4 w-4" /> Sign in to sync
            </Button>
            <Link to="/collections">
              <Button variant="outline" className="gap-2 rounded-full" size="lg">
                <Sparkles className="h-4 w-4" /> Start exploring
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground/80">
            Free account. Takes 10 seconds.
          </p>
        </div>
        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container max-w-md text-center">
          <div className="relative mx-auto inline-flex">
            <Heart className="h-16 w-16 text-accent/80" strokeWidth={1.2} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">Nothing saved yet.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tap the heart on anything you love. We'll keep it right here for you.
          </p>
          <Link to="/collections" className="mt-6 inline-block">
            <Button className="gap-2 rounded-full" size="lg">
              <Sparkles className="h-4 w-4" /> Find something fire
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <h1 className="mb-8 font-display text-3xl font-bold">Your Wishlist</h1>
        <div className="masonry-grid">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product!.id} product={product!} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
