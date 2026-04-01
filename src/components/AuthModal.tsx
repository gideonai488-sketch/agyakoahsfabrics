import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

const AuthModal = () => {
  const { isOpen, mode, setOpen, setMode, login, signup } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const result = mode === "login"
      ? await login(email, password)
      : await signup(name, email, password);
    
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setName(""); setEmail(""); setPassword("");
    }
  };

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
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 glass-modal px-6 pb-10 pt-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-center pb-2">
              <div className="h-1 w-10 rounded-full" style={{ background: "hsl(0 0% 80%)" }} />
            </div>
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-bold text-foreground">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 active:scale-90" style={{ background: "hsl(0 0% 100% / 0.5)" }}>
                <X className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl p-3 text-xs text-red-600" style={{ background: "hsl(0 80% 55% / 0.1)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input text-foreground placeholder:text-muted-foreground"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input text-foreground placeholder:text-muted-foreground"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input text-foreground placeholder:text-muted-foreground"
                required
                minLength={6}
              />
              <button type="submit" className="liquid-button mt-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  mode === "login" ? "Sign in" : "Create account"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                className="font-semibold text-primary"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
