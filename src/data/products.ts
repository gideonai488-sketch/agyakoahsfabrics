import ankaraWaxPrint from "@/assets/products/ankara-wax-print.jpg";
import kenteCloth from "@/assets/products/kente-cloth.jpg";
import embroideredLace from "@/assets/products/embroidered-lace.jpg";
import linenCottonStack from "@/assets/products/linen-cotton-stack.jpg";
import silkSatinLuxe from "@/assets/products/silk-satin-luxe.jpg";
import velvetUpholstery from "@/assets/products/velvet-upholstery.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "dr-recommended" | "hot" | "sale";
  stock?: number;
  rating: number;
  sold: number;
  category: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Signature Ankara Bloom Roll",
    price: 189.99,
    originalPrice: 259.99,
    image: ankaraWaxPrint,
    badge: "hot",
    stock: 18,
    rating: 4.8,
    sold: 2341,
    category: "Wax Prints",
    description: "Bold orange and teal wax print fabric with statement floral motifs. Ideal for dresses, two-piece sets, and standout occasion wear.",
  },
  {
    id: "2",
    name: "Royal Kente Heritage Weave",
    price: 249.99,
    originalPrice: 329.99,
    image: kenteCloth,
    badge: "dr-recommended",
    rating: 4.6,
    sold: 1892,
    category: "Kente",
    description: "Premium Ghanaian kente-inspired cloth with rich ceremonial colorwork. Perfect for bridal looks, family shoots, and custom traditional outfits.",
  },
  {
    id: "3",
    name: "Champagne Bridal Lace Deluxe",
    price: 319.99,
    originalPrice: 449.99,
    image: embroideredLace,
    badge: "sale",
    stock: 6,
    rating: 4.9,
    sold: 3421,
    category: "Lace",
    description: "Elegant embroidered lace with soft champagne undertones and refined detailing. A favorite for bridal gowns, reception looks, and couture finishing.",
  },
  {
    id: "4",
    name: "Emerald Silk Satin Luxe",
    price: 159.99,
    originalPrice: 219.99,
    image: silkSatinLuxe,
    badge: "dr-recommended",
    rating: 4.7,
    sold: 5678,
    category: "Satin",
    description: "Glossy satin blend with premium drape and vibrant jewel tones. Designed for eveningwear, bridesmaid dresses, and luxe scarf sets.",
  },
  {
    id: "5",
    name: "Natural Linen Cotton Blend",
    price: 139.99,
    originalPrice: 189.99,
    image: linenCottonStack,
    badge: "hot",
    rating: 4.5,
    sold: 8923,
    category: "Linen",
    description: "Breathable linen-cotton fabric in earthy neutrals. Great for kaftans, shirts, soft tailoring, and relaxed home décor accents.",
  },
  {
    id: "6",
    name: "Velvet Interior Statement Roll",
    price: 229.99,
    originalPrice: 299.99,
    image: velvetUpholstery,
    badge: "dr-recommended",
    stock: 7,
    rating: 4.8,
    sold: 4521,
    category: "Velvet",
    description: "Rich velvet fabric for premium upholstery and luxury décor projects. Deep color payoff with a smooth hand feel and dense finish.",
  },
  {
    id: "7",
    name: "Sunset Ankara Market Edit",
    price: 174.99,
    originalPrice: 239.99,
    image: ankaraWaxPrint,
    rating: 4.3,
    sold: 6234,
    category: "Wax Prints",
    description: "A vibrant wax print selection curated for statement tops, skirts, and family set tailoring. Durable finish with strong color retention.",
  },
  {
    id: "8",
    name: "Occasion Kente Cut",
    price: 209.99,
    originalPrice: 289.99,
    image: kenteCloth,
    badge: "sale",
    rating: 4.6,
    sold: 3892,
    category: "Kente",
    description: "A ready-to-style kente cut for ceremonies and standout fashion pieces. Balanced structure, bold pattern rhythm, and memorable color contrast.",
  },
];

export const categories = [
  "All",
  "Wax Prints",
  "Kente",
  "Lace",
  "Satin",
  "Linen",
  "Velvet",
];
