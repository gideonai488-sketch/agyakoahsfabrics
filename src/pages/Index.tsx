import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import StoreHeader from "@/components/StoreHeader";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import BottomNavBar from "@/components/BottomNavBar";
import { products } from "@/data/products";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [category, setCategory] = useState("All");

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const filtered = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen mesh-bg">
      <StoreHeader />
      <HeroCarousel />
      <CategoryBar selected={category} onSelect={setCategory} />

      <div className="grid grid-cols-2 gap-3 px-4 pb-24">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <CartDrawer />
      <AuthModal />
      <BottomNavBar />
    </div>
  );
};

export default Index;
