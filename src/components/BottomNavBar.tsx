import { Home, ShoppingBag, ShoppingCart, User, ClipboardList } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ClipboardList, label: "Orders", path: "/orders" },
  { icon: ShoppingCart, label: "Cart", path: "cart" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNavBar = () => {
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTab = (tab: typeof tabs[0]) => {
    if (tab.path === "cart") {
      toggleCart();
    } else {
      navigate(tab.path);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-2 pt-2 backdrop-blur-xl"
      style={{
        background: "hsl(0 0% 100% / 0.7)",
        borderTop: "1px solid hsl(0 0% 100% / 0.5)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.path !== "cart" && location.pathname === tab.path;
        const Icon = tab.icon;

        return (
          <button
            key={tab.label}
            onClick={() => handleTab(tab)}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-all active:scale-90"
          >
            <div className="relative">
              <Icon
                className="h-5 w-5 transition-colors"
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? "hsl(175, 55%, 45%)" : "hsl(220, 10%, 50%)" }}
              />
              {tab.path === "cart" && itemCount > 0 && (
                <motion.span
                  className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
                  style={{ background: "linear-gradient(135deg, hsl(350,80%,55%), hsl(20,90%,55%))", color: "white" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
            <span className="text-[10px] font-medium" style={{ color: isActive ? "hsl(175, 55%, 45%)" : "hsl(220, 10%, 50%)" }}>
              {tab.label}
            </span>
            {isActive && (
              <motion.div className="absolute -top-1 h-0.5 w-6 rounded-full" style={{ background: "linear-gradient(90deg, hsl(170,60%,55%), hsl(180,60%,40%))" }} layoutId="bottomNavIndicator" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavBar;
