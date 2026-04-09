import { motion } from "framer-motion";

interface CategoryBarProps {
  selected: string;
  onSelect: (cat: string) => void;
  categories?: string[];
}

const CategoryBar = ({ selected, onSelect, categories = ["All"] }: CategoryBarProps) => (
  <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
    {categories.map((cat) => (
      <motion.button
        key={cat}
        onClick={() => onSelect(cat)}
        className="relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all active:scale-95"
        style={{
          background: selected === cat
            ? "linear-gradient(135deg, hsl(170,60%,55%), hsl(180,60%,40%))"
            : "hsl(0 0% 100% / 0.5)",
          color: selected === cat ? "white" : "hsl(220,10%,45%)",
          border: "1px solid " + (selected === cat ? "transparent" : "hsl(0 0% 100% / 0.4)"),
          backdropFilter: "blur(12px)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {cat}
      </motion.button>
    ))}
  </div>
);

export default CategoryBar;
