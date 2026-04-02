import { ShoppingCart, User, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

const StoreHeader = () => {
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const user = useAuthStore((s) => s.user);
  const setAuthOpen = useAuthStore((s) => s.setOpen);

  return (
    <motion.header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "hsl(0 0% 100% / 0.6)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.4)",
      }}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
            <span className="text-sm font-bold" style={{ color: "white" }}>A</span>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">Agyakoahs Fabrics</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setAuthOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95"
            style={{ background: user ? "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" : "hsl(0 0% 100% / 0.5)" }}
          >
            <User className="h-4 w-4" strokeWidth={1.5} style={{ color: user ? "white" : "hsl(220,10%,45%)" }} />
          </button>
          <button
            onClick={toggleCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-95"
            style={{ background: "hsl(0 0% 100% / 0.5)" }}
          >
            <ShoppingCart className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            {itemCount > 0 && (
              <motion.span
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "linear-gradient(135deg, hsl(350,80%,55%), hsl(20,90%,55%))", color: "white" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={itemCount}
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default StoreHeader;
