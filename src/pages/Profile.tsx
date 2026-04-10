import { motion } from "framer-motion";
import { User, LogOut, Shield, Package, ChevronRight, Mail, Phone, Heart, Edit2, MapPin, HelpCircle, Bell, Star, Clock, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BottomNavBar from "@/components/BottomNavBar";
import AuthModal from "@/components/AuthModal";

const Profile = () => {
  const { user, profile, isAdmin, logout, setOpen, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setEditForm({ full_name: profile?.full_name || "", phone: profile?.phone || "" });
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({
      full_name: editForm.full_name,
      phone: editForm.phone,
    }).eq("user_id", user.id);
    await fetchProfile(user.id);
    setSaving(false);
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen mesh-bg pb-24">
        <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
          <h1 className="text-base font-bold text-foreground">Profile</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            <User className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-lg font-bold text-foreground">Sign in to your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track fabric orders & manage your profile</p>
          <button onClick={() => setOpen(true)} className="liquid-button mt-6 max-w-xs">Sign In / Sign Up</button>
        </div>
        <AuthModal />
        <BottomNavBar />
      </div>
    );
  }

  const menuSections = [
    {
      title: "My Shopping",
      items: [
        { icon: Package, label: "My Orders", desc: "Track deliveries & order history", action: () => navigate("/orders") },
        { icon: Heart, label: "Wishlist", desc: "Saved fabrics you love", action: () => navigate("/wishlist") },
        { icon: Clock, label: "Recently Viewed", desc: "Products you browsed", action: () => navigate("/") },
      ],
    },
    {
      title: "Account Settings",
      items: [
        { icon: Edit2, label: "Edit Profile", desc: "Update name & phone number", action: startEdit },
        { icon: MapPin, label: "Delivery Addresses", desc: "Manage saved addresses", action: () => navigate("/checkout") },
        { icon: Bell, label: "Notifications", desc: "Order & promo alerts", action: () => {} },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", desc: "FAQs & contact support", action: () => {} },
        { icon: FileText, label: "Privacy Policy", desc: "How we handle your data", action: () => navigate("/privacy") },
        { icon: Star, label: "Rate the App", desc: "Share your feedback", action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl" style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}>
        <h1 className="text-base font-bold text-foreground">Profile</h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* User Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
            <span className="text-xl font-bold text-white">
              {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">{profile?.full_name || "User"}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" /> <span className="truncate">{user.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" /> {profile.phone}
              </div>
            )}
          </div>
          <button onClick={startEdit} className="flex h-8 w-8 items-center justify-center rounded-full shrink-0" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Edit Profile Modal */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card space-y-3">
            <h3 className="text-sm font-bold text-foreground">Edit Profile</h3>
            <input placeholder="Full Name" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
            <input placeholder="Phone Number" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="glass-input text-sm text-foreground placeholder:text-muted-foreground" />
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 rounded-full py-2.5 text-sm font-medium text-muted-foreground" style={{ background: "hsl(0 0% 100% / 0.5)" }}>Cancel</button>
              <button onClick={saveProfile} disabled={saving} className="liquid-button-sm flex-1">{saving ? "Saving..." : "Save"}</button>
            </div>
          </motion.div>
        )}

        {/* Admin Button */}
        {isAdmin && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            onClick={() => navigate("/admin")} className="glass-card flex w-full items-center gap-3 active:scale-[0.98]"
            style={{ border: "1px solid hsl(var(--primary) / 0.3)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
              <Shield className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Admin Portal</p>
              <p className="text-[10px] text-muted-foreground">Manage orders, customers, analytics & catalog</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, si) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + si * 0.05 }} className="glass-card space-y-0 p-0 overflow-hidden">
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{section.title}</p>
            </div>
            {section.items.map((item, i) => (
              <button key={i} onClick={item.action} className="flex w-full items-center gap-3 px-4 py-3 active:bg-white/10 transition-colors"
                style={{ borderBottom: i < section.items.length - 1 ? "1px solid hsl(0 0% 100% / 0.2)" : "none" }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                  <item.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={logout} className="glass-card flex w-full items-center justify-center gap-2 active:scale-[0.98]"
          style={{ border: "1px solid hsl(0 70% 60% / 0.2)" }}>
          <LogOut className="h-4 w-4 text-destructive" strokeWidth={1.5} />
          <span className="text-sm font-medium text-destructive">Sign Out</span>
        </motion.button>
      </div>
      <AuthModal />
      <BottomNavBar />
    </div>
  );
};

export default Profile;
