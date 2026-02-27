import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <p className="font-display text-2xl font-bold">You're on the list 🔥</p>
          <p className="mt-2 text-sm opacity-80">We'll hit you up when new brands drop.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold">Get early access to new brands</h2>
        <p className="mt-2 text-sm opacity-80">
          Join 10,000+ people discovering underground fashion before everyone else.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
            required
          />
          <Button type="submit" variant="secondary" className="shrink-0 gap-1">
            Subscribe <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
