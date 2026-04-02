import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center mesh-bg">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen mesh-bg pb-28">
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 backdrop-blur-xl"
        style={{
          background: "hsl(0 0% 100% / 0.6)",
          borderBottom: "1px solid hsl(0 0% 100% / 0.4)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90"
          style={{ background: "hsl(0 0% 100% / 0.5)" }}
        >
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-sm font-semibold text-foreground">Fabric Details</h1>
        <button
          onClick={() => setLiked(!liked)}
          className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90"
          style={{ background: "hsl(0 0% 100% / 0.5)" }}
        >
          <Heart
            className="h-4 w-4 transition-colors"
            strokeWidth={1.5}
            fill={liked ? "hsl(350, 80%, 55%)" : "none"}
            color={liked ? "hsl(350, 80%, 55%)" : "hsl(220, 10%, 45%)"}
          />
        </button>
      </div>

      {/* Product Image */}
      <motion.div
        className="mx-4 mt-3 overflow-hidden rounded-[24px]"
        style={{ background: "hsl(0 0% 96%)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
        {/* Badges */}
        <div className="absolute left-6 top-20 flex flex-col gap-1">
          {product.badge === "dr-recommended" && (
            <span className="badge-dr">✨ Staff Pick</span>
          )}
          {product.badge === "hot" && <span className="badge-sale">🔥 HOT</span>}
          {product.badge === "sale" && discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        className="mx-4 mt-3 glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-base font-bold leading-tight text-foreground">
          {product.name}
        </h2>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5"
                fill={i < Math.floor(product.rating) ? "hsl(45, 90%, 55%)" : "none"}
                color="hsl(45, 90%, 55%)"
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} · {product.sold.toLocaleString()} sold
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            GH₵{product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="price-original text-sm">
                GH₵{product.originalPrice}
              </span>
              <span className="badge-sale">-{discount}%</span>
            </>
          )}
        </div>

        {product.stock && product.stock < 20 && (
          <p className="mt-2 text-xs font-medium" style={{ color: "hsl(0, 84%, 55%)" }}>
            ⚡ Only {product.stock} rolls left in stock!
          </p>
        )}
      </motion.div>

      {/* Description */}
      <motion.div
        className="mx-4 mt-3 glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="mb-2 text-sm font-bold text-foreground">Description</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {product.description || "Premium fabric with rich texture, strong finish, and elegant drape for custom styling."}
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        className="mx-4 mt-3 glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, label: "Nationwide\nDelivery" },
            { icon: Shield, label: "Premium\nQuality" },
            { icon: RotateCcw, label: "Easy\nReturns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "hsl(170 60% 55% / 0.1)",
                }}
              >
                <Icon className="h-4 w-4" style={{ color: "hsl(175, 55%, 45%)" }} strokeWidth={1.5} />
              </div>
              <span className="whitespace-pre-line text-center text-[10px] font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pb-3 pt-3"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)), hsl(var(--background) / 0.9), transparent)",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <button
          onClick={() => navigator.share?.({ title: product.name, url: window.location.href }).catch(() => {})}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ background: "hsl(0 0% 100% / 0.6)", border: "1px solid hsl(0 0% 100% / 0.4)" }}
        >
          <Share2 className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </button>
        <motion.button
          onClick={handleAdd}
          className="liquid-button flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          {added ? "Added! ✓" : `Add to Cart · GH₵${product.price}`}
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetail;
