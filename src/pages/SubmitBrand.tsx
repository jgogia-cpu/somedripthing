import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

export default function SubmitBrand() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    instagram: "",
    category: "",
    why: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handle = (e: FormEvent) => {
    e.preventDefault();
    // Mailto fallback — no backend wiring required
    const subject = `Brand submission: ${form.name}`;
    const body = [
      `Brand: ${form.name}`,
      `Website: ${form.url}`,
      `Instagram: ${form.instagram}`,
      `Category: ${form.category}`,
      ``,
      `Why it belongs:`,
      form.why,
    ].join("\n");
    window.location.href = `mailto:dripwayapparel@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Submit a Brand — DRIPWAY"
        description="Know a niche fashion label that deserves a spot on DRIPWAY? Submit it for curation."
        path="/submit-brand"
        type="website"
      />

      <section className="container max-w-2xl py-16 md:py-24">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
          Tip the curators
        </p>
        <h1
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)", letterSpacing: "-0.025em" }}
        >
          Submit a brand.
        </h1>
        <p className="mt-5 max-w-lg text-base text-muted-foreground">
          Know a label that belongs here? Tell us about it. We review every submission by hand.
        </p>

        {submitted ? (
          <div className="mt-12 rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
              <Check className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold">Sent.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your email client should have opened. We read every submission — give us a week.
            </p>
            <Link
              to="/brands"
              className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-accent hover:underline"
            >
              Back to brands →
            </Link>
          </div>
        ) : (
          <form onSubmit={handle} className="mt-10 space-y-5">
            <Field label="Brand name" required>
              <input
                required
                value={form.name}
                onChange={update("name")}
                className={inputCls}
                placeholder="Mortenoir"
              />
            </Field>
            <Field label="Website" required>
              <input
                required
                type="url"
                value={form.url}
                onChange={update("url")}
                className={inputCls}
                placeholder="https://"
              />
            </Field>
            <Field label="Instagram">
              <input
                value={form.instagram}
                onChange={update("instagram")}
                className={inputCls}
                placeholder="@handle"
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={update("category")}
                className={inputCls}
                placeholder="Outerwear · Streetwear · Footwear…"
              />
            </Field>
            <Field label="Why it belongs" required>
              <textarea
                required
                value={form.why}
                onChange={update("why")}
                rows={4}
                className={`${inputCls} resize-none py-3`}
                placeholder="One or two sentences. What makes them worth knowing?"
              />
            </Field>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-full bg-foreground text-sm font-semibold uppercase tracking-[0.15em] text-background hover:bg-foreground/90"
            >
              Send submission
            </Button>
            <p className="text-center text-[11px] text-muted-foreground/70">
              We never publish your details. Submissions are reviewed by a human, not a bot.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border/60 bg-secondary/40 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors min-h-[44px]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}