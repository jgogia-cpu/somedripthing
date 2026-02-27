import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById } from "@/data/brands";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  const wishlistProducts = wishlist.map(id => getProductById(id)).filter(Boolean);

  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-2xl text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h1 className="mt-4 font-display text-3xl font-bold">Your Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to save your favorite products and sync across devices.
          </p>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-2xl text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h1 className="mt-4 font-display text-3xl font-bold">Your Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            Nothing saved yet. Start{" "}
            <Link to="/explore" className="text-accent hover:underline">exploring</Link>{" "}
            to find your next favorite piece.
          </p>
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
