import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, BarChart3, Box, Building2, ChevronDown, Crown,
  Edit, ImagePlus, Loader2, Package, Plus, ShoppingCart, Trash2, TrendingUp, Users, X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, type DbProduct } from "@/hooks/useProducts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "customers", label: "Customers" },
  { id: "products", label: "Products" },
  { id: "analytics", label: "Analytics" },
  { id: "bank", label: "Bank" },
] as const;

type Tab = (typeof tabs)[number]["id"];

interface Order { id: string; user_id: string; status: string; total_amount: number; delivery_name: string | null; delivery_city: string | null; delivery_region: string | null; payment_method: string | null; created_at: string; }
interface UserProfile { id: string; user_id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string; }
interface Bank { name: string; code: string; }

const statusColors: Record<string, string> = {
  pending: "hsl(var(--primary))", processing: "hsl(var(--mint-400))", shipped: "hsl(var(--teal-500))", delivered: "hsl(145 55% 36%)", cancelled: "hsl(var(--destructive))",
};

const salesChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  orders: { label: "Orders", color: "hsl(var(--teal-500))" },
} satisfies ChartConfig;

const emptyProduct = { name: "", price: 0, original_price: null as number | null, category: "Wax Prints", badge: "", stock: 0, description: "", image_url: "" };
const categoryOptions = ["Wax Prints", "Kente", "Lace", "Satin", "Linen", "Velvet"];

const Admin = () => {
  const { isAdmin, loading } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { products, refetch: refetchProducts } = useProducts();

  // Product form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Bank state
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [businessName, setBusinessName] = useState("Agyakoahs Fabrics");
  const [resolvedName, setResolvedName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [bankMsg, setBankMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => { if (!loading && !isAdmin) navigate("/"); }, [isAdmin, loading, navigate]);
  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

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

  const currency = (v: number) => `GH₵${v.toFixed(2)}`;

  // Product CRUD
  const openAddForm = () => { setEditingId(null); setForm(emptyProduct); setShowForm(true); };
  const openEditForm = (p: DbProduct) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: p.price, original_price: p.original_price, category: p.category, badge: p.badge || "", stock: p.stock ?? 0, description: p.description || "", image_url: p.image_url || "" });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: publicUrl }));
    }
    setUploading(false);
  };

  const saveProduct = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      price: form.price,
      original_price: form.original_price || null,
      category: form.category,
      badge: form.badge || null,
      stock: form.stock,
      description: form.description || null,
      image_url: form.image_url || null,
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      await supabase.from("products").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    refetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    refetchProducts();
  };

  // Bank functions
  useEffect(() => { if (tab === "bank" && banks.length === 0) fetchBanks(); }, [tab]);

  const fetchBanks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-bank?action=list-banks`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const result = await res.json();
      if (result?.data) setBanks(result.data);
    } catch (e) { console.error("Failed to fetch banks:", e); }
  };

  const resolveAccount = async () => {
    if (!accountNumber || !bankCode) return;
    setResolving(true); setResolvedName(""); setBankMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-bank?action=resolve-account`, {
        method: "POST", headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber, bank_code: bankCode }),
      });
      const data = await res.json();
      if (data?.data?.account_name) setResolvedName(data.data.account_name);
      else setBankMsg({ type: "error", text: "Could not resolve account." });
    } catch { setBankMsg({ type: "error", text: "Failed to verify." }); }
    setResolving(false);
  };

  const linkBankAccount = async () => {
    if (!accountNumber || !bankCode || !resolvedName) return;
    setLinking(true); setBankMsg(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-bank?action=create-subaccount`, {
        method: "POST", headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ business_name: businessName, bank_code: bankCode, account_number: accountNumber, percentage_charge: 0 }),
      });
      const data = await res.json();
      if (data?.data?.subaccount_code) setBankMsg({ type: "success", text: `Bank linked! Code: ${data.data.subaccount_code}. 100% payout.` });
      else setBankMsg({ type: "error", text: data?.message || "Failed to link." });
    } catch { setBankMsg({ type: "error", text: "Failed to create subaccount." }); }
    setLinking(false);
  };

  // Stats
  const overviewStats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
    return { totalOrders: orders.length, totalRevenue, totalUsers: users.length, lowStockCount: products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 12).length };
  }, [orders, users, products]);

  const monthlySales = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); d.setDate(1);
    const mo = orders.filter((o) => { const od = new Date(o.created_at); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear(); });
    return { label: d.toLocaleDateString("en-US", { month: "short" }), revenue: mo.reduce((s, o) => s + Number(o.total_amount), 0), orders: mo.length };
  }), [orders]);

  const statusData = useMemo(() => ["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => ({ name: s, value: orders.filter((o) => o.status === s).length, fill: statusColors[s] })).filter((i) => i.value > 0), [orders]);

  const customerRows = useMemo(() => {
    const m = orders.reduce<Record<string, { spend: number; orderCount: number; lastOrder: string }>>((a, o) => {
      const c = a[o.user_id] || { spend: 0, orderCount: 0, lastOrder: o.created_at };
      a[o.user_id] = { spend: c.spend + Number(o.total_amount), orderCount: c.orderCount + 1, lastOrder: o.created_at > c.lastOrder ? o.created_at : c.lastOrder };
      return a;
    }, {});
    return users.map((u) => ({ ...u, spend: m[u.user_id]?.spend ?? 0, orderCount: m[u.user_id]?.orderCount ?? 0, lastOrder: m[u.user_id]?.lastOrder ?? null })).sort((a, b) => b.spend - a.spend);
  }, [orders, users]);

  const repeatCustomers = customerRows.filter((c) => c.orderCount > 1).length;
  const newCustomersThisMonth = customerRows.filter((c) => { const d = new Date(c.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;

  const categoryData = useMemo(() => {
    const c = products.reduce<Record<string, number>>((a, p) => { a[p.category] = (a[p.category] || 0) + 1; return a; }, {});
    return Object.entries(c).map(([cat, count]) => ({ category: cat, count })).sort((a, b) => b.count - a.count);
  }, [products]);

  const topProducts = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);
  const inventoryValue = products.reduce((s, p) => s + p.price * (p.stock ?? 0), 0);

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
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
          <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">Agyakoahs Fabrics</h1>
          <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all"
            style={{ background: tab === t.id ? "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" : "hsl(0 0% 100% / 0.5)", color: tab === t.id ? "white" : "hsl(220,10%,45%)" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* OVERVIEW */}
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
                <div><h3 className="text-sm font-bold text-foreground">Revenue trend</h3><p className="text-[10px] text-muted-foreground">Last 6 months</p></div>
                <BarChart3 className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <ChartContainer config={salesChartConfig} className="h-[220px] w-full">
                <LineChart data={monthlySales}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={36} /><ChartTooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={false} /></LineChart>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-card">
                <h3 className="mb-3 text-sm font-bold text-foreground">Order status</h3>
                {statusData.length > 0 ? (
                  <ChartContainer config={{ pending: { label: "Pending", color: statusColors.pending } }} className="h-[220px] w-full">
                    <PieChart><ChartTooltip content={<ChartTooltipContent hideLabel />} /><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={3}>{statusData.map((e) => <Cell key={e.name} fill={e.fill} />)}</Pie></PieChart>
                  </ChartContainer>
                ) : <p className="py-10 text-center text-xs text-muted-foreground">Orders will populate this chart.</p>}
              </div>
              <div className="glass-card space-y-3">
                <div className="flex items-center gap-2"><Crown className="h-4 w-4 text-primary" strokeWidth={1.5} /><h3 className="text-sm font-bold text-foreground">Quick highlights</h3></div>
                <div className="rounded-2xl bg-white/30 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Top category</p><p className="mt-1 text-sm font-semibold text-foreground">{categoryData[0]?.category || "No data"}</p></div>
                <div className="rounded-2xl bg-white/30 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">VIP customers</p><p className="mt-1 text-sm font-semibold text-foreground">{repeatCustomers} repeat buyers</p></div>
                <div className="rounded-2xl bg-white/30 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Inventory value</p><p className="mt-1 text-sm font-semibold text-foreground">{currency(inventoryValue)}</p></div>
              </div>
            </div>
            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Recent orders</h3>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.2)" }}>
                  <div><p className="text-xs font-medium text-foreground">{o.delivery_name || "Guest"}</p><p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p></div>
                  <div className="text-right"><p className="text-xs font-bold text-foreground">GH₵{Number(o.total_amount).toFixed(2)}</p><span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusColors[o.status] || statusColors.pending}20`, color: statusColors[o.status] || statusColors.pending }}>{o.status}</span></div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No orders yet</p>}
            </div>
          </motion.div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="glass-card p-0 overflow-hidden">
                <button onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} className="flex w-full items-center justify-between p-4">
                  <div className="text-left"><p className="text-xs font-semibold text-foreground">{o.delivery_name || "Guest"}</p><p className="text-[10px] text-muted-foreground">{o.delivery_city}, {o.delivery_region}</p><p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p></div>
                  <div className="flex items-center gap-2">
                    <div className="text-right"><p className="text-sm font-bold text-foreground">GH₵{Number(o.total_amount).toFixed(2)}</p><span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusColors[o.status]}20`, color: statusColors[o.status] }}>{o.status}</span></div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedOrder === o.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expandedOrder === o.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t px-4 pb-4 pt-3" style={{ borderColor: "hsl(0 0% 100% / 0.2)" }}>
                    <p className="mb-2 text-[10px] text-muted-foreground">Payment: {o.payment_method || "momo"}</p>
                    <div className="flex flex-wrap gap-2">
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <button key={s} onClick={() => updateOrderStatus(o.id, s)} className="rounded-full px-3 py-1 text-[10px] font-semibold capitalize transition-all active:scale-95"
                          style={{ background: o.status === s ? statusColors[s] : "hsl(0 0% 100% / 0.4)", color: o.status === s ? "white" : "hsl(220,10%,45%)" }}>{s}</button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
            {orders.length === 0 && <div className="glass-card text-center py-8"><Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} /><p className="text-sm text-muted-foreground">No orders yet</p></div>}
          </motion.div>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Customers</p><p className="mt-1 text-xl font-bold text-foreground">{customerRows.length}</p></div>
              <div className="glass-card"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">New this month</p><p className="mt-1 text-xl font-bold text-foreground">{newCustomersThisMonth}</p></div>
            </div>
            {customerRows.map((u) => (
              <div key={u.id} className="glass-card flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
                  <span className="text-sm font-bold text-white">{(u.full_name || u.email)?.[0]?.toUpperCase() || "U"}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{u.full_name || "No name"}</p>
                  <p className="text-[10px] text-muted-foreground">{u.email}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{u.orderCount} orders · {currency(u.spend)}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{u.lastOrder ? new Date(u.lastOrder).toLocaleDateString() : "New"}</p>
              </div>
            ))}
            {customerRows.length === 0 && <div className="glass-card text-center py-8"><Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} /><p className="text-sm text-muted-foreground">No customers yet</p></div>}
          </motion.div>
        )}

        {/* PRODUCTS (with CRUD) */}
        {tab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">{products.length} Products</p>
                <p className="text-[10px] text-muted-foreground">{categoryData.length} categories</p>
              </div>
              <button onClick={openAddForm} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
                <Plus className="h-3.5 w-3.5" /> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{editingId ? "Edit Product" : "New Product"}</h3>
                  <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>

                <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />

                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Price (GH₵)" type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                  <input placeholder="Original price" type="number" value={form.original_price || ""} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) || null })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="glass-input text-sm text-foreground">
                    {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="glass-input text-sm text-foreground">
                    <option value="">No badge</option>
                    <option value="hot">🔥 Hot</option>
                    <option value="sale">Sale</option>
                    <option value="dr-recommended">✨ Staff Pick</option>
                  </select>
                </div>

                <input placeholder="Stock quantity" type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />

                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="glass-input min-h-[80px] text-sm text-foreground placeholder:text-muted-foreground" />

                {/* Image upload */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Product Image</label>
                  {form.image_url && (
                    <img src={form.image_url} alt="Preview" className="mb-2 h-24 w-24 rounded-2xl object-cover" />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-2xl p-3 text-xs font-medium text-muted-foreground" style={{ background: "hsl(0 0% 100% / 0.4)", border: "1px dashed hsl(0 0% 80%)" }}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Upload image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                <button onClick={saveProduct} disabled={saving || !form.name || !form.price} className="liquid-button">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : editingId ? "Update Product" : "Add Product"}
                </button>
              </motion.div>
            )}

            {products.map((product) => (
              <div key={product.id} className="glass-card flex items-center gap-3">
                <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground">{product.category} · {(product.sold ?? 0).toLocaleString()} sold</p>
                  <p className="mt-1 text-xs font-medium text-foreground">{currency(product.price)} · Stock {product.stock ?? 0}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => openEditForm(product)} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
                    <Edit className="h-3.5 w-3.5 text-foreground" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "hsl(0 80% 55% / 0.1)" }}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Monthly revenue vs orders</h3>
              <ChartContainer config={salesChartConfig} className="h-[240px] w-full">
                <BarChart data={monthlySales}><CartesianGrid vertical={false} strokeDasharray="3 3" /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={36} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="revenue" fill="var(--color-revenue)" radius={[10, 10, 0, 0]} /></BarChart>
              </ChartContainer>
            </div>
            <div className="glass-card space-y-3">
              <div className="flex items-center gap-2"><Box className="h-4 w-4 text-primary" strokeWidth={1.5} /><h3 className="text-sm font-bold text-foreground">Category mix</h3></div>
              {categoryData.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-xs text-foreground"><span>{item.category}</span><span>{item.count}</span></div>
                  <div className="h-2 rounded-full bg-white/40"><div className="h-2 rounded-full" style={{ width: `${(item.count / products.length) * 100}%`, background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }} /></div>
                </div>
              ))}
            </div>
            <div className="glass-card">
              <h3 className="mb-3 text-sm font-bold text-foreground">Top performing products</h3>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white/30 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-xs font-bold text-foreground">{i + 1}</div>
                    <div className="flex-1"><p className="text-sm font-semibold text-foreground">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.category} · {(p.sold ?? 0).toLocaleString()} sold</p></div>
                    <span className="text-xs font-semibold text-foreground">{currency(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* BANK */}
        {tab === "bank" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="glass-card">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
                <div><h3 className="text-sm font-bold text-foreground">Link Bank Account</h3><p className="text-[10px] text-muted-foreground">Receive 100% of payments — no split</p></div>
              </div>
              {bankMsg && <div className="mb-3 rounded-xl p-3 text-xs" style={{ background: bankMsg.type === "success" ? "hsl(145 55% 36% / 0.1)" : "hsl(0 80% 55% / 0.1)", color: bankMsg.type === "success" ? "hsl(145 55% 36%)" : "hsl(0 80% 55%)" }}>{bankMsg.text}</div>}
              <div className="space-y-3">
                <div><label className="mb-1 block text-xs font-medium text-foreground">Business Name</label><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="glass-input text-sm text-foreground" /></div>
                <div><label className="mb-1 block text-xs font-medium text-foreground">Select Bank</label><select value={bankCode} onChange={(e) => { setBankCode(e.target.value); setResolvedName(""); }} className="glass-input text-sm text-foreground"><option value="">Choose a bank...</option>{banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}</select></div>
                <div><label className="mb-1 block text-xs font-medium text-foreground">Account Number</label><input value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value); setResolvedName(""); }} className="glass-input text-sm text-foreground" placeholder="Enter account number" maxLength={20} /></div>
                <button onClick={resolveAccount} disabled={!bankCode || !accountNumber || resolving} className="w-full rounded-2xl py-2.5 text-xs font-semibold transition-all" style={{ background: "hsl(0 0% 100% / 0.6)", border: "1px solid hsl(0 0% 100% / 0.4)", opacity: !bankCode || !accountNumber ? 0.5 : 1 }}>
                  {resolving ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Verifying...</span> : "Verify Account"}
                </button>
                {resolvedName && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-4" style={{ background: "hsl(145 55% 36% / 0.08)", border: "1px solid hsl(145 55% 36% / 0.2)" }}><p className="text-xs text-muted-foreground">Account Name</p><p className="mt-1 text-sm font-bold text-foreground">{resolvedName}</p></motion.div>}
                {resolvedName && <button onClick={linkBankAccount} disabled={linking} className="liquid-button">{linking ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Linking...</span> : "Link Bank Account (100% Payout)"}</button>}
              </div>
            </div>
            <div className="glass-card"><h3 className="mb-2 text-sm font-bold text-foreground">How it works</h3><div className="space-y-2 text-xs text-muted-foreground"><p>1. Select your bank and enter your account number</p><p>2. Verify the account name matches</p><p>3. Link your account — all payments go directly to you</p><p>4. No split fees — you receive 100% of the payment amount</p></div></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
