import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Up to 60% Off",
    subtitle: "Professional Oral Care",
    desc: "98.2% Whiter results. Your enamel will thank you.",
    cta: "Shop Now",
    gradient: "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%), hsl(200,50%,45%))",
    emoji: "✨",
  },
  {
    title: "New Arrivals",
    subtitle: "Invisible Braces & Trainers",
    desc: "Straighten teeth at home. Comfortable & effective.",
    cta: "Explore",
    gradient: "linear-gradient(135deg, hsl(260,50%,55%), hsl(280,45%,50%), hsl(300,40%,55%))",
    emoji: "🦷",
  },
  {
    title: "Flash Sale 🔥",
    subtitle: "Pain Relief Products",
    desc: "Instant relief sprays & gels. Limited stock available!",
    cta: "Grab Deal",
    gradient: "linear-gradient(135deg, hsl(350,70%,55%), hsl(20,80%,55%), hsl(40,90%,55%))",
    emoji: "💊",
  },
  {
    title: "Kids Special",
    subtitle: "Orthodontic Trainers",
    desc: "Correct alignment naturally. Ages 5-12.",
    cta: "Shop Kids",
    gradient: "linear-gradient(135deg, hsl(200,60%,50%), hsl(220,55%,55%), hsl(240,50%,60%))",
    emoji: "👶",
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
