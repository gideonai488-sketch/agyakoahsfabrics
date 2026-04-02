import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Box,
  ChevronDown,
  Crown,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
  { id: "analytics", label: "Analytics" },
] as const;

type Tab = (typeof tabs)[number]["id"];

interface Order {
  id: string;
  user_id: string;
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
  pending: "hsl(var(--primary))",
  processing: "hsl(var(--mint-400))",
  shipped: "hsl(var(--teal-500))",
  delivered: "hsl(145 55% 36%)",
  cancelled: "hsl(var(--destructive))",
};

const salesChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--teal-500))" },
} satisfies ChartConfig;

const Admin = () => {
  const { isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
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

    setOrders((ordersRes.data || []) as Order[]);
    setUsers((usersRes.data || []) as UserProfile[]);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const currency = (value: number) => `GH₵${value.toFixed(2)}`;

  const overviewStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    return {
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: users.length,
      lowStockCount: products.filter((product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 12).length,
    };
  }, [orders, users]);

  const monthlySales = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      date.setDate(1);

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
      });

      return {
        label: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0),
        orders: monthOrders.length,
      };
    });
  }, [orders]);

  const statusData = useMemo(
    () =>
      ["pending", "processing", "shipped", "delivered", "cancelled"]
        .map((status) => ({
          name: status,
          value: orders.filter((order) => order.status === status).length,
          fill: statusColors[status],
        }))
        .filter((item) => item.value > 0),
    [orders],
  );

  const customerRows = useMemo(() => {
    const metrics = orders.reduce<Record<string, { spend: number; orderCount: number; lastOrder: string }>>((acc, order) => {
      const current = acc[order.user_id] || { spend: 0, orderCount: 0, lastOrder: order.created_at };
      acc[order.user_id] = {
        spend: current.spend + Number(order.total_amount),
        orderCount: current.orderCount + 1,
        lastOrder: order.created_at > current.lastOrder ? order.created_at : current.lastOrder,
      };
      return acc;
    }, {});

    return users
      .map((user) => ({
        ...user,
        spend: metrics[user.user_id]?.spend ?? 0,
        orderCount: metrics[user.user_id]?.orderCount ?? 0,
        lastOrder: metrics[user.user_id]?.lastOrder ?? null,
      }))
      .sort((a, b) => b.spend - a.spend);
  }, [orders, users]);

  const repeatCustomers = customerRows.filter((customer) => customer.orderCount > 1).length;
  const newCustomersThisMonth = customerRows.filter((customer) => {
    const date = new Date(customer.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const categoryData = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const lowStockProducts = products.filter((product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 12);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const inventoryValue = products.reduce((sum, product) => sum + product.price * (product.stock ?? 0), 0);

  if (loading) return <div className="flex min-h-screen items-center justify-center mesh-bg"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!isAdmin) return null;

  const statCards = [
    { icon: ShoppingCart, label: "Orders", value: overviewStats.totalOrders },
    { icon: TrendingUp, label: "Revenue", value: currency(overviewStats.totalRevenue) },
    { icon: Users, label: "Customers", value: overviewStats.totalUsers },
    { icon: AlertTriangle, label: "Low stock", value: overviewStats.lowStockCount },
  ];

  return (
    <div className="min-h-screen mesh-bg pb-8">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">Agyakoahs Fabrics</h1>
          <p className="text-[10px] text-muted-foreground">Admin analytics & catalog control</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t.id ? "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" : "hsl(0 0% 100% / 0.5)",
              color: tab === t.id ? "white" : "hsl(220,10%,45%)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((s) => (
                <div key={s.label} className="glass-card">
                  <s.icon className="mb-2 h-5 w-5 text-primary" strokeWidth={1.5} />
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Revenue trend</h3>
                  <p className="text-[10px] text-muted-foreground">Last 6 months performance</p>
                </div>
                <BarChart3 className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <ChartContainer config={salesChartConfig} className="h-[220px] w-full">
                <LineChart data={monthlySales}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={false} />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-card">
                <h3 className="mb-3 text-sm font-bold text-foreground">Order status</h3>
                {statusData.length > 0 ? (
                  <ChartContainer
                    config={{ pending: { label: "Pending", color: statusColors.pending } }}
                    className="h-[220px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <p className="py-10 text-center text-xs text-muted-foreground">Orders will populate this chart automatically.</p>
                )}
              </div>

              <div className="glass-card space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  <h3 className="text-sm font-bold text-foreground">Quick highlights</h3>
                </div>
                <div className="rounded-2xl bg-white/30 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Top category</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{categoryData[0]?.category || "No data yet"}</p>
                </div>
                <div className="rounded-2xl bg-white/30 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">VIP customers</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{repeatCustomers} repeat buyers</p>
                </div>
                <div className="rounded-2xl bg-white/30 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Inventory value</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{currency(inventoryValue)}</p>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Recent orders</h3>
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
                     <p className="mb-2 text-[10px] text-muted-foreground">Delivery to {o.delivery_city || "—"}, {o.delivery_region || "—"} · Payment: {o.payment_method || "momo"}</p>
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

        {tab === "customers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Customers</p>
                <p className="mt-1 text-xl font-bold text-foreground">{customerRows.length}</p>
              </div>
              <div className="glass-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">New this month</p>
                <p className="mt-1 text-xl font-bold text-foreground">{newCustomersThisMonth}</p>
              </div>
            </div>
            {customerRows.map((u) => (
              <div key={u.id} className="glass-card flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
                  <span className="text-sm font-bold" style={{ color: "white" }}>
                    {(u.full_name || u.email)?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{u.full_name || "No name"}</p>
                  <p className="text-[10px] text-muted-foreground">{u.email}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{u.orderCount} orders · {currency(u.spend)}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{u.lastOrder ? new Date(u.lastOrder).toLocaleDateString() : "New"}</p>
              </div>
            ))}
            {customerRows.length === 0 && (
              <div className="glass-card text-center py-8">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">No customers yet</p>
              </div>
            )}
          </motion.div>
        )}

        {tab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Catalog size</p>
                <p className="mt-1 text-xl font-bold text-foreground">{products.length}</p>
              </div>
              <div className="glass-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Categories</p>
                <p className="mt-1 text-xl font-bold text-foreground">{categoryData.length}</p>
              </div>
            </div>

            {products.map((product) => (
              <div key={product.id} className="glass-card flex items-center gap-3">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" width={64} height={64} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{product.name}</p>
                    {product.badge && <span className="badge-dr">{product.badge === "sale" ? "Promo" : product.badge === "hot" ? "Hot" : "Featured"}</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{product.category} · {product.sold.toLocaleString()} sold</p>
                  <p className="mt-1 text-xs font-medium text-foreground">{currency(product.price)} · Stock {product.stock ?? 0}</p>
                </div>
                <div className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: (product.stock ?? 0) <= 12 ? "hsl(var(--destructive) / 0.12)" : "hsl(var(--accent) / 0.12)", color: (product.stock ?? 0) <= 12 ? "hsl(var(--destructive))" : "hsl(var(--teal-500))" }}>
                  {(product.stock ?? 0) <= 12 ? "Low stock" : "In stock"}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Monthly revenue vs orders</h3>
              <ChartContainer config={salesChartConfig} className="h-[240px] w-full">
                <BarChart data={monthlySales}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="glass-card space-y-3">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <h3 className="text-sm font-bold text-foreground">Category mix</h3>
              </div>
              {categoryData.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-xs text-foreground">
                    <span>{item.category}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/40">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.count / products.length) * 100}%`,
                        background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Top performing products</h3>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-white/30 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-xs font-bold text-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.category} · {product.sold.toLocaleString()} sold</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{currency(product.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
