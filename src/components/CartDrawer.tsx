import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, total } = useCartStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "hsl(0 0% 0% / 0.3)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden glass-modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full" style={{ background: "hsl(0 0% 80%)" }} />
            </div>

            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <h2 className="text-lg font-bold text-foreground">Fabric Cart</h2>
              <button onClick={() => setCartOpen(false)} className="rounded-full p-1 active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
                <X className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <ShoppingBag className="mb-3 h-12 w-12 opacity-30" strokeWidth={1} />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs">Add a fabric roll or luxury cut to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      className="flex gap-3 rounded-2xl p-3"
                      style={{ background: "hsl(0 0% 100% / 0.4)", border: "1px solid hsl(0 0% 100% / 0.3)" }}
                      layout
                      exit={{ opacity: 0, x: -100 }}
                    >
                      <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="price-tag text-sm">GH₵{item.product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full active:scale-90"
                            style={{ background: "hsl(0 0% 100% / 0.6)", border: "1px solid hsl(0 0% 100% / 0.4)" }}
                          >
                            <Minus className="h-3 w-3 text-foreground" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full active:scale-90"
                            style={{ background: "hsl(0 0% 100% / 0.6)", border: "1px solid hsl(0 0% 100% / 0.4)" }}
                          >
                            <Plus className="h-3 w-3 text-foreground" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-[10px] text-destructive"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t px-5 pb-8 pt-4" style={{ borderColor: "hsl(0 0% 100% / 0.3)" }}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold tabular-nums text-foreground">GH₵{total().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); navigate("/checkout"); }}
                  className="liquid-button"
                >
                  Checkout Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
