import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container relative text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Check className="h-6 w-6 text-accent" />
          </div>
          <p className="font-display text-2xl font-bold">You're on the list 🔥</p>
          <p className="mt-2 text-sm opacity-60">We'll hit you up when new brands drop.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
      <div className="container relative max-w-xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Get early access to new brands</h2>
          <p className="mt-3 text-sm opacity-50 leading-relaxed">
            Join 10,000+ people discovering underground fashion before everyone else.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 rounded-xl border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent/50 focus:ring-accent/20"
              required
            />
            <Button type="submit" variant="secondary" className="h-12 shrink-0 gap-1.5 rounded-xl px-6 font-semibold transition-all hover:shadow-lg">
              Subscribe <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
