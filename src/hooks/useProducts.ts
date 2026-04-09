import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  stock: number | null;
  rating: number | null;
  sold: number | null;
  category: string;
  description: string | null;
}

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const items = (data || []) as DbProduct[];
    setProducts(items);

    const cats = ["All", ...Array.from(new Set(items.map((p) => p.category)))];
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, categories, refetch: fetchProducts };
}
