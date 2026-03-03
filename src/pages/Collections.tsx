import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, getBrandById } from "@/data/brands";
import { useCurrency } from "@/contexts/CurrencyContext";

const WEEKLY_COLLECTION = {
  title: "Heat Check",
  subtitle: "This Week's Must-Haves",
  description:
    "Our editors hand-picked the hardest pieces dropping this week — from statement leather to heritage streetwear. No filler, just heat.",
  date: "Week of March 3, 2026",
  picks: ["p29", "p45", "p51", "p35", "p48", "p55", "p42", "p22"],
};

export default function Collections() {
  const { formatPrice } = useCurrency();
  const collectionProducts = WEEKLY_COLLECTION.picks
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary py-20 text-primary-foreground md:py-28">
        <div className="container">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-widest">
                {WEEKLY_COLLECTION.date}
              </span>
            </div>
            <h1
              className="mt-3 text-5xl font-bold tracking-tight md:text-7xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {WEEKLY_COLLECTION.title}
            </h1>
            <p
              className="mt-2 text-2xl font-light text-primary-foreground/80 md:text-3xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {WEEKLY_COLLECTION.subtitle}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/60">
              {WEEKLY_COLLECTION.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collection Grid — blog-style large images */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-20">
            {collectionProducts.map((product, i) => {
              const brand = getBrandById(product.brandId);
              const isEven = i % 2 === 0;
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`flex flex-col gap-8 md:flex-row md:items-center ${
                    !isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Large Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="group flex-1 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Pick #{i + 1}
                    </span>
                    {brand && (
                      <Link
                        to={`/brand/${brand.slug}`}
                        className="mt-2 text-sm font-medium text-accent hover:underline"
                      >
                        {brand.name}
                      </Link>
                    )}
                    <h2
                      className="mt-1 text-3xl font-bold leading-tight md:text-4xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.name}
                    </h2>
                    <p className="mt-3 text-lg font-bold text-accent">
                      {formatPrice(product.price)}
                      {product.originalPrice && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.aesthetics.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link to={`/product/${product.id}`}>
                        <Button className="rounded-full gap-2">
                          View Product
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Want more?
          </h2>
          <p className="mt-2 text-primary-foreground/60">
            New collection drops every week. Stay in the loop.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/explore">
              <Button
                variant="outline"
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Explore All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
