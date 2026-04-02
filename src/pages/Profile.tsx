import { motion } from "framer-motion";
import { User, LogOut, Shield, Package, ChevronRight, Mail, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavBar";
import AuthModal from "@/components/AuthModal";

const Profile = () => {
  const { user, profile, isAdmin, logout, setOpen } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen mesh-bg pb-24">
        <div
          className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl"
          style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}
        >
          <h1 className="text-base font-bold text-foreground">Profile</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "hsl(170 60% 55% / 0.1)" }}
          >
            <User className="h-8 w-8" style={{ color: "hsl(175, 55%, 45%)" }} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-lg font-bold text-foreground">Sign in to your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track fabric orders & manage your profile</p>
          <button onClick={() => setOpen(true)} className="liquid-button mt-6 max-w-xs">
            Sign In / Sign Up
          </button>
        </div>
        <AuthModal />
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 backdrop-blur-xl"
        style={{ background: "hsl(0 0% 100% / 0.6)", borderBottom: "1px solid hsl(0 0% 100% / 0.4)" }}
      >
        <h1 className="text-base font-bold text-foreground">Profile</h1>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* User Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
            <span className="text-xl font-bold" style={{ color: "white" }}>
              {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{profile?.full_name || "User"}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" /> {user.email}
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {profile.phone}
              </div>
            )}
          </div>
        </motion.div>

        {/* Admin Button */}
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate("/admin")}
            className="glass-card flex w-full items-center gap-3 active:scale-[0.98]"
            style={{ border: "1px solid hsl(170 60% 55% / 0.3)" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)))" }}>
              <Shield className="h-5 w-5" style={{ color: "white" }} strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Admin Portal</p>
              <p className="text-[10px] text-muted-foreground">Manage orders, customers, analytics & catalog</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}

        {/* Menu Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card space-y-0 p-0 overflow-hidden">
          {[
            { icon: Package, label: "My Orders", action: () => navigate("/orders") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="flex w-full items-center gap-3 px-4 py-3.5 active:bg-white/10"
              style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.2)" }}
            >
              <item.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span className="flex-1 text-left text-sm text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={logout}
          className="glass-card flex w-full items-center justify-center gap-2 active:scale-[0.98]"
          style={{ border: "1px solid hsl(0 70% 60% / 0.2)" }}
        >
          <LogOut className="h-4 w-4" style={{ color: "hsl(0, 70%, 55%)" }} strokeWidth={1.5} />
          <span className="text-sm font-medium" style={{ color: "hsl(0, 70%, 55%)" }}>Sign Out</span>
        </motion.button>
      </div>
      <AuthModal />
      <BottomNavBar />
    </div>
  );
};

export default Profile;
