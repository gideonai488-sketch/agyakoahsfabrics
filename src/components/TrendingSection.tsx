import { motion } from "framer-motion";
import { DbProduct } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";

interface TrendingSectionProps {
  products: DbProduct[];
}

const TrendingSection = ({ products }: TrendingSectionProps) => {
  const navigate = useNavigate();
  // Pick top 10 trending (by sold count)
  const trending = [...products]
    .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
    .slice(0, 10);

  if (trending.length === 0) return null;

  return (
    <div className="mt-4 px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-foreground">Trending Now</h3>
        <button
          onClick={() => navigate("/shop")}
          className="text-xs font-semibold"
          style={{ color: "hsl(var(--teal-500))" }}
        >
          See all
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
        {trending.map((product, i) => {
          const imageUrl = product.image_url?.startsWith("http") ? product.image_url : "/placeholder.svg";
          return (
            <motion.div
              key={product.id}
              className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl"
              style={{ width: 140, height: 180 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Rank number */}
              <span className="absolute bottom-2 left-2 text-3xl font-black text-white drop-shadow-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                {i + 1}
              </span>
              {/* Badge */}
              {product.badge === "hot" && (
                <span className="absolute right-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "hsl(350, 80%, 55%)" }}>
                  HOT
                </span>
              )}
              {product.badge === "sale" && (
                <span className="absolute right-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "hsl(350, 80%, 55%)" }}>
                  SALE
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSection;
