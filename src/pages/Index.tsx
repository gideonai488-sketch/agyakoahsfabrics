import { useState, useCallback, useMemo } from "react";
import SplashScreen from "@/components/SplashScreen";
import StoreHeader from "@/components/StoreHeader";
import HeroCarousel from "@/components/HeroCarousel";
import TrendingSection from "@/components/TrendingSection";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import BottomNavBar from "@/components/BottomNavBar";
import { useProducts } from "@/hooks/useProducts";

// Seeded shuffle so products reorder on each page load but stay stable during session
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [category, setCategory] = useState("All");
  const { products, loading, categories } = useProducts();

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // Shuffle products once when they load, so layout feels fresh each visit
  const shuffled = useMemo(() => shuffleArray(products), [products]);

  const filtered = category === "All"
    ? shuffled
    : shuffled.filter((p) => p.category === category);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen mesh-bg">
      <StoreHeader />
      <HeroCarousel products={shuffled} />
      <TrendingSection products={products} />
      <CategoryBar selected={category} onSelect={setCategory} categories={categories} />

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
            <p className="col-span-2 py-12 text-center text-sm text-muted-foreground">No products found</p>
          )}
        </div>
      )}

      <CartDrawer />
      <AuthModal />
      <BottomNavBar />
    </div>
  );
};

export default Index;
