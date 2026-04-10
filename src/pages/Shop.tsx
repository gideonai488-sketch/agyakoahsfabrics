import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import BottomNavBar from "@/components/BottomNavBar";
import { useProducts } from "@/hooks/useProducts";

const sortOptions = [
  { label: "Trending", value: "trending" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Most Sold", value: "sold" },
];

const Shop = () => {
  const { products, loading, categories } = useProducts();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("trending");
  const [showFilters, setShowFilters] = useState(false);

  let filtered = category === "All" ? [...products] : products.filter((p) => p.category === category);

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }

  // Sort
  switch (sort) {
    case "price-asc": filtered.sort((a, b) => a.price - b.price); break;
    case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
    case "rating": filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    case "sold": filtered.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)); break;
    default: // trending - mix of sold + rating
      filtered.sort((a, b) => ((b.sold ?? 0) * 0.3 + (b.rating ?? 0) * 100) - ((a.sold ?? 0) * 0.3 + (a.rating ?? 0) * 100));
  }

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 px-4 py-3 backdrop-blur-xl space-y-2" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90 shrink-0" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
            <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              placeholder="Search fabrics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90 shrink-0" style={{ background: showFilters ? "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" : "hsl(0 0% 100% / 0.5)" }}>
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} style={{ color: showFilters ? "white" : "hsl(220,10%,45%)" }} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Sort By</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sortOptions.map((o) => (
                <button key={o.value} onClick={() => setSort(o.value)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-medium transition-all"
                  style={{
                    background: sort === o.value ? "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" : "hsl(0 0% 100% / 0.5)",
                    color: sort === o.value ? "white" : "hsl(220,10%,45%)",
                    border: "1px solid " + (sort === o.value ? "transparent" : "hsl(0 0% 100% / 0.4)"),
                  }}
                >{o.label}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all active:scale-95"
            style={{
              background: category === cat ? "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" : "hsl(0 0% 100% / 0.5)",
              color: category === cat ? "white" : "hsl(220,10%,45%)",
              border: "1px solid " + (category === cat ? "transparent" : "hsl(0 0% 100% / 0.4)"),
              backdropFilter: "blur(12px)",
            }}
          >{cat}</button>
        ))}
      </div>

      <div className="px-4 pb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} fabric{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 pb-24">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-12 text-center text-sm text-muted-foreground">No fabrics found matching your search</p>
          )}
        </div>
      )}

      <CartDrawer />
      <AuthModal />
      <BottomNavBar />
    </div>
  );
};

export default Shop;
