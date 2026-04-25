import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/brands";

interface ScrapedRow {
  id: string;
  brand_id: string;
  brand_name: string;
  handle: string;
  name: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  category: string;
  aesthetics: string[];
  sizes: string[];
  affiliate_url: string;
}

function rowToProduct(r: ScrapedRow): Product {
  return {
    id: `s-${r.id}`,
    name: r.name,
    brandId: r.brand_id,
    brandName: r.brand_name,
    image: r.image,
    images: r.images,
    price: Number(r.price),
    description: r.description,
    category: r.category,
    aesthetics: r.aesthetics,
    sizes: r.sizes,
    affiliateUrl: r.affiliate_url,
    trending: true,
    newArrival: true,
  };
}

let cache: Product[] | null = null;

export function useScrapedProducts(): Product[] {
  const [items, setItems] = useState<Product[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("scraped_products")
        .select("*")
        .order("scraped_at", { ascending: false });
      if (error || !data || cancelled) return;
      const products = (data as ScrapedRow[]).map(rowToProduct);
      cache = products;
      setItems(products);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}