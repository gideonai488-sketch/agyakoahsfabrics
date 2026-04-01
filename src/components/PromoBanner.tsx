import { motion } from "framer-motion";

const PromoBanner = () => (
  <motion.div
    className="mx-4 mt-3 overflow-hidden rounded-[20px] p-5"
    style={{
      background: "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%), hsl(200,50%,45%))",
      boxShadow: "0 8px 32px hsl(170 60% 55% / 0.25)",
    }}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
  >
    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(0 0% 100% / 0.7)" }}>
      Limited Time
    </p>
    <h2 className="mt-1 text-xl font-bold leading-tight" style={{ color: "white" }}>
      Up to 60% off<br />Professional Oral Care
    </h2>
    <p className="mt-1 text-xs" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
      98.2% Whiter results. Your enamel will thank you.
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
