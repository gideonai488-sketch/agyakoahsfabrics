import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Agyakoahs Fabrics",
    subtitle: "Signature Wax Prints",
    desc: "Fresh market drops, premium 6-yard cuts, and statement patterns for every occasion.",
    cta: "Shop Wax Prints",
    gradient: "linear-gradient(135deg, hsl(var(--mint-400)), hsl(var(--teal-500)), hsl(var(--accent)))",
    emoji: "🧵",
  },
  {
    title: "Luxury Edit",
    subtitle: "Lace, Satin & Kente",
    desc: "Curated textures for weddings, tailoring, church wear, and standout custom pieces.",
    cta: "Explore Luxury",
    gradient: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--mint-400)), hsl(var(--teal-500)))",
    emoji: "👗",
  },
  {
    title: "Low Stock Alert",
    subtitle: "Bridal Lace Favourites",
    desc: "Best-selling lace sets are moving fast—secure your preferred color story while it lasts.",
    cta: "Grab Yours",
    gradient: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--teal-500)), hsl(var(--foreground)))",
    emoji: "✨",
  },
  {
    title: "Tailor-Ready Picks",
    subtitle: "Premium Everyday Fabrics",
    desc: "From breathable linens to rich velvet, build a catalog your customers can feel instantly.",
    cta: "Browse Catalog",
    gradient: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)), hsl(var(--mint-400)))",
    emoji: "🪡",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="mx-4 mt-3">
      <div
        className="relative overflow-hidden rounded-[20px]"
        style={{ minHeight: 160 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="p-5"
            style={{
              background: slide.gradient,
              boxShadow: "0 8px 32px hsl(170 60% 55% / 0.25)",
              borderRadius: 20,
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "hsl(0 0% 100% / 0.7)" }}
            >
              {slide.emoji} Limited Time
            </p>
            <h2
              className="mt-1 text-xl font-bold leading-tight"
              style={{ color: "white" }}
            >
              {slide.title}
              <br />
              {slide.subtitle}
            </h2>
            <p className="mt-1 text-xs" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
              {slide.desc}
            </p>
            <button
              className="mt-3 rounded-full px-5 py-2 text-xs font-semibold transition-all active:scale-95"
              style={{ background: "white", color: "hsl(180,60%,35%)" }}
            >
              {slide.cta}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === current ? 16 : 6,
                background: i === current ? "white" : "hsl(0 0% 100% / 0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
