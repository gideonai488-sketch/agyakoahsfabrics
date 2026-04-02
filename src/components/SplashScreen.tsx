import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"scan" | "reveal" | "exit">("scan");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1500);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onComplete, 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center mesh-bg"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Fabric stack with scan */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <svg width="92" height="92" viewBox="0 0 92 92" fill="none" className="drop-shadow-lg">
            <rect x="12" y="18" width="68" height="16" rx="8" fill="url(#fabricGradient1)" stroke="hsl(var(--teal-500))" strokeWidth="1.5" />
            <rect x="18" y="38" width="56" height="16" rx="8" fill="url(#fabricGradient2)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <rect x="24" y="58" width="44" height="16" rx="8" fill="url(#fabricGradient3)" stroke="hsl(var(--teal-500))" strokeWidth="1.5" />
            <defs>
              <linearGradient id="fabricGradient1" x1="12" y1="18" x2="80" y2="34">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.95)" />
                <stop offset="100%" stopColor="hsl(var(--mint-400) / 0.95)" />
              </linearGradient>
              <linearGradient id="fabricGradient2" x1="18" y1="38" x2="74" y2="54">
                <stop offset="0%" stopColor="hsl(var(--accent) / 0.92)" />
                <stop offset="100%" stopColor="hsl(var(--teal-500) / 0.95)" />
              </linearGradient>
              <linearGradient id="fabricGradient3" x1="24" y1="58" x2="68" y2="74">
                <stop offset="0%" stopColor="hsl(var(--mint-400) / 0.92)" />
                <stop offset="100%" stopColor="hsl(var(--foreground) / 0.85)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Scan line */}
          {phase === "scan" && (
            <motion.div
              className="absolute left-0 right-0 h-0.5 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(175, 55%, 45%), transparent)",
                boxShadow: "0 0 12px hsl(175, 55%, 45%)",
              }}
              initial={{ top: 0 }}
              animate={{ top: 96 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>

        {/* Brand */}
        <motion.h1
          className="text-3xl font-bold logo-shimmer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === "reveal" || phase === "scan" ? 1 : 0, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Agyakoahs Fabrics
        </motion.h1>

        <motion.p
          className="mt-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Premium fabrics for every statement look.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
