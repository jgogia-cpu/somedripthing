import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type State =
  | { kind: "loading" }
  | { kind: "confirm"; email: string }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const FN_URL = `https://wpadinulltmnllrsaimv.supabase.co/functions/v1/handle-email-unsubscribe`;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.email) setState({ kind: "confirm", email: data.email });
        else if (data.reason === "already_used") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch (e) {
        setState({ kind: "error", message: e instanceof Error ? e.message : "Network error" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setState({ kind: "success" });
      else setState({ kind: "error", message: "Could not unsubscribe. Try again later." });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Network error" });
    }
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-20">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-background/40 p-8 text-center backdrop-blur-md">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">DRIPWAY</p>

        {state.kind === "loading" && (
          <p className="mt-6 text-sm text-muted-foreground">Checking your link…</p>
        )}

        {state.kind === "confirm" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Unsubscribe {state.email}?</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You'll stop receiving the weekly Heat Check newsletter.
            </p>
            <Button onClick={confirm} className="mt-6 w-full">Confirm unsubscribe</Button>
          </>
        )}

        {state.kind === "success" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">You're unsubscribed.</h1>
            <p className="mt-3 text-sm text-muted-foreground">Sorry to see you go. You can resubscribe anytime from the footer.</p>
          </>
        )}

        {state.kind === "already" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Already unsubscribed</h1>
            <p className="mt-3 text-sm text-muted-foreground">This email is no longer on the list.</p>
          </>
        )}

        {state.kind === "invalid" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Invalid link</h1>
            <p className="mt-3 text-sm text-muted-foreground">This unsubscribe link is missing or expired.</p>
          </>
        )}

        {state.kind === "error" && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
          </>
        )}
      </div>
    </div>
  );
}