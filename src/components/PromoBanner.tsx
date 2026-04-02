import { motion } from "framer-motion";

const PromoBanner = () => (
  <motion.div
    className="mx-4 mt-3 overflow-hidden rounded-[20px] p-5"
    style={{
      background: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)), hsl(var(--accent)))",
      boxShadow: "0 8px 32px hsl(var(--mint-400) / 0.25)",
    }}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
  >
    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(0 0% 100% / 0.7)" }}>
      New Drop
    </p>
    <h2 className="mt-1 text-xl font-bold leading-tight" style={{ color: "white" }}>
      Agyakoahs Fabrics<br />Luxury Textile Edit
    </h2>
    <p className="mt-1 text-xs" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
      Premium wax prints, bridal lace, satin and kente curated for modern tailoring.
    </p>
    <button
      className="mt-3 rounded-full px-5 py-2 text-xs font-semibold transition-all active:scale-95"
      style={{ background: "white", color: "hsl(180,60%,35%)" }}
    >
      Shop Now
    </button>
  </motion.div>
);

export default PromoBanner;
