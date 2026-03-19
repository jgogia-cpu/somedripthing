import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";

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
      </div>
    </div>
  );
}
