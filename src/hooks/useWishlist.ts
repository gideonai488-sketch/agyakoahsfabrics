import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function useWishlist() {
  const { user } = useAuthStore();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlistIds(new Set()); return; }
    setLoading(true);
    const { data } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id);
    setWishlistIds(new Set((data || []).map((w: any) => w.product_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!user) return false;
    if (wishlistIds.has(productId)) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      setWishlistIds((prev) => { const n = new Set(prev); n.delete(productId); return n; });
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setWishlistIds((prev) => new Set(prev).add(productId));
    }
    return true;
  };

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  return { wishlistIds, loading, toggleWishlist, isWishlisted, refetch: fetchWishlist };
}
