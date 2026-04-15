import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Info } from "lucide-react";
import { DbProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";

interface HeroCarouselProps {
  products?: DbProduct[];
}

const HeroCarousel = ({ products = [] }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  // Pick top 5 products (or fewer) for hero
  const heroProducts = products.slice(0, 5);

  useEffect(() => {
    if (heroProducts.length === 0) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % heroProducts.length), 5000);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  if (heroProducts.length === 0) {
    return null;
  }

  const product = heroProducts[current];
  const imageUrl = product?.image_url?.startsWith("http") ? product.image_url : "/placeholder.svg";

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price ?? undefined,
      image: product.image_url || "/placeholder.svg",
      badge: product.badge as any,
      stock: product.stock ?? undefined,
      rating: product.rating ?? 4.5,
      sold: product.sold ?? 0,
      category: product.category,
      description: product.description ?? undefined,
    });
  };

  return (
    <div className="relative w-full" style={{ height: 380 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Full-bleed product image */}
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, hsl(0 0% 0% / 0.75) 0%, hsl(0 0% 0% / 0.3) 40%, transparent 70%)",
            }}
          />

          {/* Product info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
            <p className="text-xs font-medium" style={{ color: "hsl(var(--mint-400))" }}>
              #{current + 1} in Shopping Today
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white leading-tight">
              {product.name}
            </h2>
            <div className="mt-1.5 flex items-center gap-2">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs text-white/80">
                {product.rating ?? 4.5} · {(product.sold ?? 0).toLocaleString()} sold
              </span>
              <span className="text-sm font-bold" style={{ color: "hsl(var(--mint-400))" }}>
                GH₵{product.price.toFixed(2)}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-2 flex gap-2">
              <span className="rounded-full px-3 py-1 text-[10px] font-medium text-white/90" style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(8px)" }}>
                {product.category}
              </span>
              {product.badge && (
                <span className="rounded-full px-3 py-1 text-[10px] font-medium text-white/90" style={{ background: "hsl(0 0% 100% / 0.15)", backdropFilter: "blur(8px)" }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all active:scale-95"
                style={{ background: "white", color: "hsl(0 0% 10%)" }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all active:scale-95"
                style={{ background: "hsl(0 0% 100% / 0.2)", color: "white", backdropFilter: "blur(8px)" }}
              >
                <Info className="h-4 w-4" />
                More Info
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 right-4 flex gap-1.5 z-10">
        {heroProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === current ? 18 : 6,
              background: i === current ? "white" : "hsl(0 0% 100% / 0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
