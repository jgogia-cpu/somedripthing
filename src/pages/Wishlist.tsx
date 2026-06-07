import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById } from "@/data/brands";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  const wishlistProducts = wishlist.map(id => getProductById(id)).filter(Boolean);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container max-w-md text-center">
          <div className="relative mx-auto inline-flex">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-2xl" />
            <Heart className="h-16 w-16 text-accent/80" strokeWidth={1.2} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">Build your wishlist.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Save the pieces you're eyeing. Sync across devices. Get notified when prices drop.
          </p>
          <Link to="/collections" className="mt-6 inline-block">
            <Button className="gap-2 rounded-full" size="lg">
              <Sparkles className="h-4 w-4" /> Start exploring
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container max-w-md text-center">
          <div className="relative mx-auto inline-flex">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-2xl" />
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
