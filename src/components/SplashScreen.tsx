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
        {/* Tooth silhouette with scan */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <svg width="80" height="96" viewBox="0 0 80 96" fill="none" className="drop-shadow-lg">
            <path
              d="M40 4C28 4 20 12 16 20C12 28 8 40 12 52C16 64 20 76 24 84C28 92 32 92 36 84C38 78 40 72 40 72C40 72 42 78 44 84C48 92 52 92 56 84C60 76 64 64 68 52C72 40 68 28 64 20C60 12 52 4 40 4Z"
              fill="url(#toothGradient)"
              stroke="hsl(175, 55%, 45%)"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="toothGradient" x1="12" y1="4" x2="68" y2="92">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="hsl(195, 20%, 92%)" />
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
          Dr. Smile Confident
        </motion.h1>

        <motion.p
          className="mt-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Professional grade. Bathroom shelf approved.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
