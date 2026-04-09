import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { DbProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: DbProduct;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const imageUrl = product.image_url?.startsWith("http")
    ? product.image_url
    : product.image_url || "/placeholder.svg";

  return (
    <motion.div
      className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden" style={{ background: "#f8f8f8" }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badge === "dr-recommended" && (
            <span className="badge-dr">✨ Staff Pick</span>
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
            Only {product.stock} rolls left
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {product.name}
        </h3>

        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-muted-foreground">
            {product.rating ?? 4.5} · {(product.sold ?? 0).toLocaleString()} sold
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="price-tag text-base font-bold">GH₵{product.price}</span>
            {product.original_price && (
              <span className="ml-1.5 price-original text-xs">GH₵{product.original_price}</span>
            )}
          </div>
          <motion.button
            onClick={handleAdd}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90"
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
      </div>
    </motion.div>
  );
};

export default ProductCard;
