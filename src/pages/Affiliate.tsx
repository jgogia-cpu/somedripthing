import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, CheckCircle, Rocket, TrendingUp, Sparkles, BarChart3 } from "lucide-react";
import SEO from "@/components/SEO";

export default function Affiliate() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const brandName = data.get("brandName") as string;
    const contactName = data.get("contactName") as string;
    const email = data.get("email") as string;
    const website = data.get("website") as string;
    const instagram = data.get("instagram") as string;
    const message = data.get("message") as string;

    const subject = encodeURIComponent(`Affiliate Request: ${brandName}`);
    const body = encodeURIComponent(
      `Brand Name: ${brandName}\nContact Name: ${contactName}\nEmail: ${email}\nWebsite: ${website}\nInstagram: ${instagram}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:dripwayapparel@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Email client opened! Send the email to complete your submission.");
    }, 500);
  };

  return (
    <div className="min-h-screen py-16">
      <SEO
        title="Affiliate Program | DRIPWAY"
        description="Apply to join the DRIPWAY affiliate program and get your independent fashion brand discovered by Gen Z and Millennial shoppers."
        path="/affiliate"
      />
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Become an Affiliate
          </h1>
          <p className="mt-3 text-muted-foreground">
            Got a brand that fits the DRIPWAY aesthetic? We'd love to hear from you. Fill out the form below and we'll be in touch.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 flex flex-col items-center gap-4 rounded-2xl border bg-card p-12 text-center"
          >
            <CheckCircle className="h-12 w-12 text-accent" />
            <h2 className="font-display text-2xl font-bold">We Got You!</h2>
            <p className="text-muted-foreground">
              Your email client should have opened with your details. Hit send and we'll review your submission soon.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-12 space-y-5 rounded-2xl border bg-card p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Brand Name *</label>
                <Input name="brandName" required placeholder="Your brand name" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Contact Name *</label>
                <Input name="contactName" required placeholder="Your name" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email *</label>
              <Input name="email" type="email" required placeholder="you@brand.com" className="rounded-xl" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Website</label>
                <Input name="website" placeholder="https://yourbrand.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Instagram</label>
                <Input name="instagram" placeholder="@yourbrand" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Tell us about your brand *</label>
              <Textarea
                name="message"
                required
                rows={5}
                placeholder="What's your brand about? What aesthetics do you align with? Why DRIPWAY?"
                className="rounded-xl"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2 rounded-full text-sm font-bold">
              <Send className="h-4 w-4" />
              {loading ? "Opening email..." : "Submit Application"}
            </Button>
          </motion.form>
        )}

        {/* Coming Soon: Boost Your Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-card p-8 md:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3 w-3" /> Coming Soon
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Boost Your Brand
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Get in front of more shoppers. Pay for premium placement, homepage priority, and the analytics to back it up.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/50 bg-background/40 p-5">
                <Rocket className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-semibold">Higher Visibility</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pinned across category and discovery feeds for sustained reach.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/40 p-5">
                <TrendingUp className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-semibold">Homepage Priority</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Featured slots in the hero carousel and curated drops.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/40 p-5">
                <BarChart3 className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-semibold">Brand Insights</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Real-time clicks, saves, and conversion data on every product.
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Want early access? Mention "Boost" in your application above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
