import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Package } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";
import BottomNavBar from "@/components/BottomNavBar";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_city: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "hsl(45, 90%, 50%)",
  processing: "hsl(210, 80%, 55%)",
  shipped: "hsl(270, 60%, 55%)",
  delivered: "hsl(150, 60%, 45%)",
  cancelled: "hsl(0, 70%, 55%)",
};

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setOrders(data);
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
         <h1 className="text-base font-bold text-foreground">My Orders</h1>
      </div>

      {!user || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="mb-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "hsl(170 60% 55% / 0.1)" }}>
            <ClipboardList className="h-8 w-8" style={{ color: "hsl(175, 55%, 45%)" }} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-lg font-bold text-foreground">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your fabric order history will appear here</p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {orders.map((o) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${statusColors[o.status] || statusColors.pending}20` }}>
                <Package className="h-5 w-5" style={{ color: statusColors[o.status] || statusColors.pending }} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">Order #{o.id.slice(0, 8)}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">GH₵{Number(o.total_amount).toFixed(2)}</p>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>{o.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <BottomNavBar />
    </div>
  );
};

export default Orders;
