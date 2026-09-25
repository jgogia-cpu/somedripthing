import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email: value, source: "homepage", unsubscribed_at: null }, { onConflict: "email" });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't subscribe", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="relative overflow-hidden border-b border-border bg-accent py-24 text-accent-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container relative text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-accent-foreground/30">
            <Check className="h-6 w-6" />
          </div>
          <p className="font-display text-3xl font-bold">You're on the list.</p>
          <p className="mt-2 text-sm opacity-60">We'll hit you up when new brands drop.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-accent py-20 text-accent-foreground md:py-28">
      <div className="container relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="border-t border-accent-foreground/30 pt-3 text-[10px] font-bold uppercase tracking-[0.3em]">The Monday dispatch</p>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
          <h2 className="font-display text-5xl font-bold leading-[0.95] md:text-7xl">Get the Heat Check before everyone else.</h2>
          <p className="mt-4 max-w-xl text-sm opacity-70 leading-relaxed">
            Join 10,000+ people discovering underground fashion before everyone else.
          </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 md:col-span-5">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 rounded-none border-accent-foreground/30 bg-transparent text-accent-foreground placeholder:text-accent-foreground/50"
              required
            />
            <Button type="submit" disabled={loading} className="h-12 shrink-0 gap-1.5 rounded-none px-6 font-semibold uppercase tracking-[0.12em]">
              {loading ? "…" : "Subscribe"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
