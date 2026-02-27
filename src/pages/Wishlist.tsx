import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Wishlist() {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-2xl text-center">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <h1 className="mt-4 font-display text-3xl font-bold">Your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Save brands and products you love. Sign in to sync across devices.
        </p>
        <p className="mt-8 text-sm text-muted-foreground">
          Nothing saved yet. Start{" "}
          <Link to="/explore" className="text-accent hover:underline">exploring</Link>{" "}
          to find your next favorite brand.
        </p>
      </div>
    </div>
  );
}
