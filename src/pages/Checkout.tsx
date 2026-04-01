import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, Truck, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/AuthModal";

const Checkout = () => {
  const { items, total, clearCart } = useCartStore();
  const { user, setOpen: setAuthOpen } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"delivery" | "payment" | "success">("delivery");
  const [address, setAddress] = useState({ name: "", street: "", city: "", region: "", phone: "", landmark: "" });
  const [submitting, setSubmitting] = useState(false);

  const shipping = 35.00;
  const grandTotal = total() + shipping;

  const placeOrder = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setSubmitting(true);
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      status: "pending",
      total_amount: grandTotal,
      delivery_name: address.name,
      delivery_phone: address.phone,
      delivery_region: address.region,
      delivery_city: address.city,
      delivery_address: address.street,
      delivery_landmark: address.landmark,
      payment_method: "momo",
    }).select().single();

    if (order && !error) {
      await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        }))
      );
      setStep("success");
    }
    setSubmitting(false);
  };

  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center mesh-bg px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="mb-6 flex h-24 w-24 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" }}>
          <span className="text-4xl">✨</span>
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Delivering to {address.city || "your location"}, {address.region}</p>
        <p className="mt-1 text-xs text-muted-foreground">Arriving in 3-5 business days</p>
        <button onClick={() => { clearCart(); navigate("/"); }} className="liquid-button mt-8 max-w-xs">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pb-32">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => step === "payment" ? setStep("delivery") : navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-bold text-foreground">{step === "delivery" ? "Delivery Address" : "Payment"}</h1>
      </div>

      <div className="flex gap-2 px-4 py-4">
        {["delivery", "payment"].map((s, i) => (
          <div key={s} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.4)" }}>
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(170,60%,55%), hsl(180,60%,40%))" }} initial={{ width: 0 }} animate={{ width: step === "delivery" ? (i === 0 ? "100%" : "0%") : "100%" }} transition={{ duration: 0.4 }} />
          </div>
        ))}
      </div>

      <motion.div className="px-4" key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        {step === "delivery" ? (
          <div className="space-y-3">
            <div className="glass-card">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} /> Delivery Location
              </div>
              <div className="space-y-3">
                <input placeholder="Recipient Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                <input placeholder="Street / House No." value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="City / Town" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                  <input placeholder="Region" value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                </div>
                <input placeholder="Nearest Landmark" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                <input placeholder="Phone (e.g. 024 XXX XXXX)" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="glass-card">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Truck className="h-4 w-4 text-primary" strokeWidth={1.5} /> Shipping Method
              </div>
              <label className="flex items-center justify-between rounded-xl p-3 cursor-pointer" style={{ background: "hsl(170 60% 55% / 0.08)", border: "1px solid hsl(170 60% 55% / 0.2)" }}>
                <div>
                  <p className="text-xs font-medium text-foreground">Standard Delivery</p>
                  <p className="text-[10px] text-muted-foreground">3-5 business days</p>
                </div>
                <span className="text-sm font-semibold text-foreground">GH₵{shipping.toFixed(2)}</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="glass-card">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" strokeWidth={1.5} /> Payment Details
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {["Mobile Money", "Card"].map((method) => (
                    <button key={method} className="flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all" style={{ background: "hsl(0 0% 100% / 0.5)", border: "1px solid hsl(0 0% 100% / 0.4)" }}>{method}</button>
                  ))}
                </div>
                <input placeholder="Mobile Money / Card number" className="glass-input text-sm text-foreground placeholder:text-muted-foreground tabular-nums" />
                <input placeholder="Account name" className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="glass-card">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} /> Order Summary
              </div>
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground line-clamp-1 flex-1">{item.product.name} × {item.quantity}</span>
                  <span className="text-xs font-medium tabular-nums text-foreground">GH₵{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t pt-2" style={{ borderColor: "hsl(0 0% 100% / 0.3)" }}>
                <span className="text-xs text-muted-foreground">Shipping</span>
                <span className="text-xs font-medium tabular-nums text-foreground">GH₵{shipping.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="text-lg font-bold tabular-nums text-foreground">GH₵{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}>
        <button
          onClick={() => step === "delivery" ? setStep("payment") : placeOrder()}
          className="liquid-button"
          disabled={submitting}
        >
          {step === "delivery" ? "Continue to Payment" : submitting ? "Placing Order..." : `Pay GH₵${grandTotal.toFixed(2)}`}
        </button>
      </div>
      <AuthModal />
    </div>
  );
};

export default Checkout;
