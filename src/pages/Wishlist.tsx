import { motion } from "framer-motion";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import BottomNavBar from "@/components/BottomNavBar";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { products } = useProducts();

  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-bold text-foreground">My Wishlist</h1>
        <span className="ml-auto text-xs text-muted-foreground">{wishlistProducts.length} items</span>
      </div>

      {!user ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
          <h2 className="text-lg font-bold text-foreground">Sign in to view your wishlist</h2>
          <p className="mt-1 text-sm text-muted-foreground">Save your favorite fabrics for later</p>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            <Heart className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-lg font-bold text-foreground">Your wishlist is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart icon on products to save them here</p>
          <button onClick={() => navigate("/")} className="liquid-button mt-6 max-w-xs">Browse Fabrics</button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {wishlistProducts.map((product, i) => {
            const imageUrl = product.image_url?.startsWith("http") ? product.image_url : "/placeholder.svg";
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card flex items-center gap-3 p-3 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={imageUrl} alt={product.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</h3>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{product.category}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-foreground">GH₵{product.price}</span>
                    {product.original_price && <span className="text-[10px] line-through text-muted-foreground">GH₵{product.original_price}</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full shrink-0" style={{ background: "hsl(0 84% 60% / 0.1)" }}>
                  <Trash2 className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
      <BottomNavBar />
    </div>
  );
};

export default Wishlist;
