import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable";

export default function Auth() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const initialMode = (params.get("mode") === "signup" ? "signup" : "signin") as
    | "signin"
    | "signup";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subscribe, setSubscribe] = useState(true);

  const handleOAuth = async (provider: "google" | "apple") => {
    setError("");
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message);
  };

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password, displayName, subscribe);
      if (error) setError(error.message);
      else setSuccess("Check your email to confirm your account!");
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate(redirect, { replace: true });
    }
    setLoading(false);
  };

  return (
    <main className="container flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
        <Link
          to={redirect}
          className="mb-4 inline-block text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? "Welcome Back" : "Join DRIPWAY"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to access your wishlist"
            : "Create an account to save your favorites"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <Input
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {mode === "signup" && (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-3 text-left text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[--accent]"
              />
              <span>
                Send me the <span className="font-semibold text-foreground">Monday Heat Check</span> newsletter — one email a week, the freshest drops we co-signed.
              </span>
            </label>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-accent">{success}</p>}

          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={() => handleOAuth("google")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full rounded-full"
          onClick={() => handleOAuth("apple")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.93 2.39-4.34 2.5-4.41-1.36-1.99-3.48-2.26-4.24-2.29-1.81-.18-3.53 1.06-4.45 1.06-.93 0-2.34-1.04-3.85-1.01-1.98.03-3.81 1.15-4.83 2.92-2.06 3.57-.53 8.85 1.48 11.75.98 1.42 2.15 3.02 3.69 2.96 1.48-.06 2.04-.96 3.83-.96 1.78 0 2.29.96 3.86.93 1.59-.03 2.6-1.45 3.58-2.88 1.13-1.65 1.59-3.25 1.62-3.33-.04-.02-3.11-1.19-3.14-4.74M14.16 3.4c.81-.98 1.36-2.34 1.21-3.69-1.17.05-2.58.78-3.42 1.76-.75.87-1.41 2.25-1.23 3.58 1.3.1 2.63-.66 3.44-1.65"/></svg>
          Continue with Apple
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setSuccess("");
            }}
            className="font-medium text-accent hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}