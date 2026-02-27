import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist when user changes
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setWishlist(data?.map(d => d.product_id) || []);
        setLoading(false);
      });
  }, [user]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) return;
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
    } else {
      setWishlist(prev => [...prev, productId]);
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
    }
  }, [user, wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
