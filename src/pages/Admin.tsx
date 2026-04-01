import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Users, ShoppingCart, TrendingUp, Eye, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Tab = "overview" | "orders" | "users";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  delivery_name: string | null;
  delivery_city: string | null;
  delivery_region: string | null;
  payment_method: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "hsl(45, 90%, 50%)",
  processing: "hsl(210, 80%, 55%)",
  shipped: "hsl(270, 60%, 55%)",
  delivered: "hsl(150, 60%, 45%)",
  cancelled: "hsl(0, 70%, 55%)",
};

const Admin = () => {
  const { isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, pendingOrders: 0 });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [ordersRes, usersRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);

    const o = ordersRes.data || [];
    const u = usersRes.data || [];
    setOrders(o);
    setUsers(u);
    setStats({
      totalOrders: o.length,
      totalRevenue: o.reduce((sum, x) => sum + Number(x.total_amount), 0),
      totalUsers: u.length,
      pendingOrders: o.filter((x) => x.status === "pending").length,
    });
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    setStats((prev) => ({
      ...prev,
      pendingOrders: orders.filter((o) => (o.id === orderId ? status : o.status) === "pending").length,
    }));
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center mesh-bg"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!isAdmin) return null;

  const statCards = [
    { icon: ShoppingCart, label: "Orders", value: stats.totalOrders, color: "hsl(210, 80%, 55%)" },
    { icon: TrendingUp, label: "Revenue", value: `GH₵${stats.totalRevenue.toFixed(0)}`, color: "hsl(150, 60%, 45%)" },
    { icon: Users, label: "Users", value: stats.totalUsers, color: "hsl(270, 60%, 55%)" },
    { icon: Package, label: "Pending", value: stats.pendingOrders, color: "hsl(45, 90%, 50%)" },
  ];

  return (
    <div className="min-h-screen mesh-bg pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-bold text-foreground">Admin Portal</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 px-4 py-3">
        {(["overview", "orders", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" : "hsl(0 0% 100% / 0.5)",
              color: tab === t ? "white" : "hsl(220,10%,45%)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4">
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((s) => (
                <div key={s.label} className="glass-card">
                  <s.icon className="h-5 w-5 mb-2" style={{ color: s.color }} strokeWidth={1.5} />
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="glass-card">
              <h3 className="text-sm font-bold text-foreground mb-3">Recent Orders</h3>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.2)" }}>
                  <div>
                    <p className="text-xs font-medium text-foreground">{o.delivery_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">GH₵{Number(o.total_amount).toFixed(2)}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusColors[o.status] || statusColors.pending}20`, color: statusColors[o.status] || statusColors.pending }}>{o.status}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No orders yet</p>}
            </div>
          </motion.div>
        )}

        {tab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="glass-card p-0 overflow-hidden">
                <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} className="flex w-full items-center justify-between p-4">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-foreground">{o.delivery_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground">{o.delivery_city}, {o.delivery_region}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">GH₵{Number(o.total_amount).toFixed(2)}</p>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>{o.status}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedOrder === o.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expandedOrder === o.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t px-4 pb-4 pt-3" style={{ borderColor: "hsl(0 0% 100% / 0.2)" }}>
                    <p className="text-[10px] text-muted-foreground mb-2">Phone: {o.delivery_name} | Payment: {o.payment_method}</p>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateOrderStatus(o.id, s)}
                          className="rounded-full px-3 py-1 text-[10px] font-semibold capitalize transition-all active:scale-95"
                          style={{
                            background: o.status === s ? statusColors[s] : "hsl(0 0% 100% / 0.4)",
                            color: o.status === s ? "white" : "hsl(220,10%,45%)",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
            {orders.length === 0 && (
              <div className="glass-card text-center py-8">
                <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            )}
          </motion.div>
        )}

        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="glass-card flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))" }}>
                  <span className="text-sm font-bold" style={{ color: "white" }}>
                    {(u.full_name || u.email)?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{u.full_name || "No name"}</p>
                  <p className="text-[10px] text-muted-foreground">{u.email}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
              </div>
            ))}
            {users.length === 0 && (
              <div className="glass-card text-center py-8">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">No users yet</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
