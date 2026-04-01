import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="glass-card cursor-pointer"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative mb-3 overflow-hidden rounded-2xl" style={{ background: "hsl(0 0% 96%)" }}>
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badge === "dr-recommended" && (
            <span className="badge-dr">🩺 Dr. Pick</span>
          )}
          {product.badge === "hot" && (
            <span className="badge-sale">🔥 HOT</span>
          )}
          {product.badge === "sale" && discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
        </div>
        {product.stock && product.stock < 20 && (
          <span className="badge-stock absolute bottom-2 left-2">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="mb-1 line-clamp-2 text-xs font-medium leading-tight text-foreground">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="mb-1.5 flex items-center gap-1">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        <span className="text-[10px] text-muted-foreground">
          {product.rating} · {product.sold.toLocaleString()} sold
        </span>
      </div>

      {/* Price + Add */}
      <div className="flex items-end justify-between">
        <div>
          <span className="price-tag text-sm">GH₵{product.price}</span>
          {product.originalPrice && (
            <span className="ml-1 price-original text-[10px]">GH₵{product.originalPrice}</span>
          )}
        </div>
        <motion.button
          onClick={handleAdd}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90"
          style={{
            background: added
              ? "hsl(170, 60%, 45%)"
              : "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))",
            color: "white",
          }}
          whileTap={{ scale: 0.85 }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
