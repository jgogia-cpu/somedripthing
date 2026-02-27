import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/brands";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="masonry-item group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 3 === 1 ? "4/5" : "1/1" }}
          />
          <button
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => { e.preventDefault(); }}
          >
            <Heart className="h-4 w-4" />
          </button>
          {product.newArrival && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              New
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.brandName}
          </p>
          <p className="text-sm font-medium leading-tight">{product.name}</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">${product.price}</p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">${product.originalPrice}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
