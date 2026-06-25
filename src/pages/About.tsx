import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { brands } from "@/data/brands";

export default function About() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Manifesto — DRIPWAY"
        description="Why DRIPWAY exists. A curated discovery engine for niche, independent and underground fashion brands the algorithm refuses to show you."
        path="/about"
        type="website"
      />

      {/* Manifesto hero */}
      <section className="container max-w-4xl py-20 md:py-32">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
          The Manifesto
        </p>
        <h1
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.025em" }}
        >
          The algorithm is a bad{" "}
          <span className="italic font-light text-foreground/70">stylist.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          DRIPWAY exists because discovery is broken. Instagram surfaces the same five brands
          to everyone. TikTok pushes whatever a paid placement told it to push. Search engines
          show the labels with the biggest ad budgets — never the ones with the best work.
        </p>
      </section>

      {/* Body */}
      <section className="border-y border-border/30 bg-secondary/15 py-16">
        <div className="container grid max-w-5xl gap-12 md:grid-cols-[200px_1fr]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            What we do
          </p>
          <div className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-[17px]">
            <p>
              We hand-pick independent labels — the ones cutting and sewing in their own
              studios, the ones running 40-piece drops, the ones whose Instagram has 800
              followers and a runway-grade lookbook. Every brand here was put in front of a
              human who decided it was worth your attention.
            </p>
            <p>
              There is no pay-to-play. No promoted listings dressed up as recommendations.
              Brands earn placement by being good, not by paying for visibility.
            </p>
            <p>
              We are unapologetically curatorial. If a label is everywhere, you don't need
              us to find it. If it's nowhere — but it should be — that's the work.
            </p>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-16 grid gap-12 md:grid-cols-[200px_1fr]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          How it works
        </p>
        <div className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-[17px]">
          <p>
            Browse the directory. Filter by aesthetic — streetwear, minimalist, archive,
            grunge, old money, avant-garde. Save what catches you. Visit the brand. Buy
            from them directly.
          </p>
          <p>
            We add new labels every week. The Monday newsletter sends the freshest finds
            straight to your inbox. No algorithm. No noise. One email.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/30 bg-secondary/15 py-12">
        <div className="container grid max-w-4xl grid-cols-3 gap-6 text-center">
          {[
            { value: brands.length, label: "Brands curated" },
            { value: "Weekly", label: "New drops added" },
            { value: "0", label: "Paid placements" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="font-display text-3xl font-bold text-accent md:text-5xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {s.value}
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-3xl py-20 text-center">
        <h2
          className="font-display font-bold leading-[1] tracking-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.02em" }}
        >
          Find before everyone else.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/brands">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-full bg-foreground px-7 text-sm font-semibold uppercase tracking-[0.15em] text-background hover:bg-foreground/90"
            >
              Enter the directory
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link to="/submit-brand">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border/60 px-7 text-sm font-semibold uppercase tracking-[0.15em]"
            >
              Submit a brand
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}