import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/brands";
import type { Product } from "@/data/brands";

let hiddenIds: Set<string> = new Set();
let ready = false;

export async function loadHiddenProducts(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("hidden_products")
      .select("product_id");
    if (error || !data) {
      ready = true;
      return;
    }
    hiddenIds = new Set(data.map((r) => r.product_id));
    // Splice hidden items out of the shared static products array so every
    // consumer that already imported it sees the filtered list.
    for (let i = products.length - 1; i >= 0; i--) {
      if (hiddenIds.has(products[i].id)) products.splice(i, 1);
    }
  } catch {
    // Ignore — worst case we show a product with a broken image for one session.
  } finally {
    ready = true;
  }
}

export function isHidden(id: string): boolean {
  return hiddenIds.has(id);
}

export function filterHidden<T extends Pick<Product, "id">>(list: T[]): T[] {
  if (!hiddenIds.size) return list;
  return list.filter((p) => !hiddenIds.has(p.id));
}

export function isHiddenProductsReady(): boolean {
  return ready;
}