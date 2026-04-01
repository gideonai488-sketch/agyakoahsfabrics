import bambooToothbrushes from "@/assets/products/bamboo-toothbrushes.jpg";
import moldableFalseTeeth from "@/assets/products/moldable-false-teeth.jpg";
import dentalVeneers from "@/assets/products/dental-veneers.jpg";
import oralIrrigator from "@/assets/products/oral-irrigator.jpg";
import tongueScraper from "@/assets/products/tongue-scraper.jpg";
import electricTeethCleaner from "@/assets/products/electric-teeth-cleaner.jpg";
import tongueCleansingGel from "@/assets/products/tongue-cleansing-gel.jpg";
import whitenToothpasteViaty from "@/assets/products/whitening-toothpaste-viaty.jpg";
import sp6WhiteningToothpaste from "@/assets/products/sp6-whitening-toothpaste.jpg";
import tongueCleansingGel2 from "@/assets/products/tongue-cleansing-gel-2.jpg";
import invisibleBraces from "@/assets/products/invisible-braces.jpg";
import kidsTrainer from "@/assets/products/kids-trainer.jpg";
import orthodonticTrainer from "@/assets/products/orthodontic-trainer.jpg";
import toothacheSpray from "@/assets/products/toothache-spray.jpg";

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
    name: "Bamboo Toothbrush Set (10 Pack)",
    price: 89.99,
    originalPrice: 169.99,
    image: bambooToothbrushes,
    badge: "hot",
    stock: 23,
    rating: 4.8,
    sold: 2341,
    category: "Toothbrushes",
    description: "Eco-friendly bamboo toothbrushes with soft BPA-free bristles. Perfect for the whole family. Biodegradable handles reduce plastic waste.",
  },
  {
    id: "2",
    name: "Moldable False Teeth Kit",
    price: 129.99,
    originalPrice: 209.99,
    image: moldableFalseTeeth,
    badge: "dr-recommended",
    rating: 4.6,
    sold: 1892,
    category: "Dental Care",
    description: "Professional-grade moldable false teeth kit. Easy to customize at home for a natural-looking smile. Includes fitting beads and instructions.",
  },
  {
    id: "3",
    name: "Premium Dental Veneers",
    price: 249.99,
    originalPrice: 419.99,
    image: dentalVeneers,
    badge: "sale",
    stock: 8,
    rating: 4.9,
    sold: 3421,
    category: "Veneers",
    description: "Ultra-thin custom-fit dental veneers for a Hollywood smile. Snap-on design requires no adhesive. Comfortable for all-day wear.",
  },
  {
    id: "4",
    name: "Portable Oral Irrigator",
    price: 209.99,
    originalPrice: 349.99,
    image: oralIrrigator,
    badge: "dr-recommended",
    rating: 4.7,
    sold: 5678,
    category: "Irrigators",
    description: "Rechargeable water flosser with 3 pressure modes. Removes 99.9% of plaque from treated areas. USB-C charging, travel-friendly.",
  },
  {
    id: "5",
    name: "Rose Gold Tongue Scraper Set",
    price: 69.99,
    originalPrice: 139.99,
    image: tongueScraper,
    badge: "hot",
    rating: 4.5,
    sold: 8923,
    category: "Tongue Care",
    description: "Premium stainless steel tongue scrapers with rose gold finish. Eliminates bad breath bacteria. Set of 2 with travel case.",
  },
  {
    id: "6",
    name: "Sonic Electric Teeth Cleaner",
    price: 279.99,
    originalPrice: 489.99,
    image: electricTeethCleaner,
    badge: "dr-recommended",
    stock: 15,
    rating: 4.8,
    sold: 4521,
    category: "Electric Cleaners",
    description: "High-frequency sonic vibration removes tartar and stains. 5 cleaning modes with LED light. Dentist-recommended for daily use.",
  },
  {
    id: "7",
    name: "Tongue Cleansing Gel - Mint",
    price: 59.99,
    originalPrice: 99.99,
    image: tongueCleansingGel,
    rating: 4.3,
    sold: 6234,
    category: "Tongue Care",
    description: "Refreshing mint tongue cleansing gel that kills 99% of odor-causing bacteria. Gentle formula safe for daily use.",
  },
  {
    id: "8",
    name: "Viaty Whitening Toothpaste",
    price: 109.99,
    originalPrice: 169.99,
    image: whitenToothpasteViaty,
    badge: "sale",
    rating: 4.6,
    sold: 3892,
    category: "Toothpaste",
    description: "Advanced whitening formula with activated charcoal and baking soda. Visible results in 7 days. Enamel-safe ingredients.",
  },
  {
    id: "9",
    name: "SP-6 Ultra Whitening Toothpaste",
    price: 139.99,
    originalPrice: 229.99,
    image: sp6WhiteningToothpaste,
    badge: "dr-recommended",
    rating: 4.9,
    sold: 7234,
    category: "Toothpaste",
    description: "SP-6 probiotic whitening toothpaste repairs enamel while whitening. Contains hydroxyapatite for tooth remineralization.",
  },
  {
    id: "10",
    name: "Deep Tongue Cleansing Treatment",
    price: 79.99,
    image: tongueCleansingGel2,
    rating: 4.4,
    sold: 2156,
    category: "Tongue Care",
    description: "Professional-strength tongue cleansing treatment. Deep cleans taste buds and removes coating. Fresh breath guaranteed.",
  },
  {
    id: "11",
    name: "Multi-Functional Invisible Braces",
    price: 189.99,
    originalPrice: 319.99,
    image: invisibleBraces,
    badge: "hot",
    stock: 12,
    rating: 4.7,
    sold: 4123,
    category: "Orthodontics",
    description: "Clear invisible braces for teeth alignment. Comfortable silicone material. Available in 3 stages for progressive correction.",
  },
  {
    id: "12",
    name: "Kids Dental Alignment Trainer A1/A2",
    price: 149.99,
    originalPrice: 249.99,
    image: kidsTrainer,
    badge: "dr-recommended",
    rating: 4.8,
    sold: 3567,
    category: "Orthodontics",
    description: "Phase 1 & Phase 2 alignment trainers for kids ages 5-12. Corrects breathing habits and aligns teeth naturally without wires.",
  },
  {
    id: "13",
    name: "Pre-Orthodontic T4K Trainer Set",
    price: 169.99,
    originalPrice: 289.99,
    image: orthodonticTrainer,
    badge: "sale",
    rating: 4.6,
    sold: 2890,
    category: "Orthodontics",
    description: "Myofunctional research trainer for kids. Corrects tongue thrust, mouth breathing and teeth crowding. Includes pink and blue variants.",
  },
  {
    id: "14",
    name: "Toothache Relief Spray (20ml)",
    price: 49.99,
    originalPrice: 89.99,
    image: toothacheSpray,
    badge: "hot",
    rating: 4.5,
    sold: 6789,
    category: "Pain Relief",
    description: "Instant pain relief spray for toothaches, gum pain, denture pain and canker sores. Fast-acting numbing formula. Pocket-sized 20ml bottle.",
  },
];

export const categories = [
  "All",
  "Toothbrushes",
  "Toothpaste",
  "Dental Care",
  "Veneers",
  "Irrigators",
  "Electric Cleaners",
  "Tongue Care",
  "Orthodontics",
  "Pain Relief",
];
