import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sprout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Brand } from "@/components/kg/Brand";
import { LanguageToggle } from "@/components/kg/LanguageToggle";
import heroImg from "@/assets/farmer-inspect.jpg";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "login" | "signup" } => ({
    ...(search['mode'] === "signup" ? { mode: "signup" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Farmer Login & Registration — KRISHI-GUARD AI" },
      {
        name: "description",
        content:
          "Create your KRISHI-GUARD AI farmer account or sign in to view your farm sensors, AI recommendations and alerts.",
      },
      { property: "og:title", content: "Farmer Login — KRISHI-GUARD AI" },
      { property: "og:description", content: "Sign in to your smart farming dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (isSignup) {
        if (fullName.trim().length < 2) throw new Error("Please enter your full name.");
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim(), mobile: mobile.trim(), village: village.trim() },
          },
        });
        if (err) throw err;
        if (!data.session) setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setError("Google sign-in is unavailable right now. Please use email and password.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  async function reset() {
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError("Enter your email first, then tap Forgot password.");
      return;
    }
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) setError(err.message);
    else setMessage("Password reset link sent to your email.");
  }

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="Farmer inspecting crop leaves in a field" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/25" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <Sprout className="size-9 text-fresh" />
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">
            Your farm, monitored and understood.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Soil, water, nutrients, weather and crop health — in one dashboard, with advice you can act on today.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="inline-block">
              <Brand />
            </Link>
            <LanguageToggle />
          </div>
          <div className="hidden">
            <Brand />
          </Link>
          <h1 className="mt-8 font-display text-2xl font-semibold text-forest">
            {isSignup ? "Create your farmer account" : "Welcome back, farmer"}
          </h1>
          <p className="mt-1.5 text-sm text-earth">
            {isSignup ? "A few details about you and your farm to get started." : "Sign in to view your live farm data."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            {isSignup && (
              <>
                <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Ramesh Kumar" required maxLength={80} />
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field label="Mobile number" value={mobile} onChange={setMobile} placeholder="98765 43210" maxLength={15} />
                  <Field label="Village / Town" value={village} onChange={setVillage} placeholder="Tirupati" maxLength={60} />
                </div>
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="farmer@example.com" required maxLength={255} />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              required
              maxLength={72}
            />

            {error && <p className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
            {message && <p className="rounded-xl bg-fresh/15 p-3 text-sm text-agri">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-earth">
            <span className="h-px flex-1 bg-forest/10" /> or <span className="h-px flex-1 bg-forest/10" />
          </div>

          <button
            onClick={() => void google()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm font-semibold text-forest hover:bg-mint"
          >
            Continue with Google
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            <button onClick={() => setIsSignup((v) => !v)} className="font-medium text-agri hover:underline">
              {isSignup ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
            {!isSignup && (
              <button onClick={() => void reset()} className="text-earth hover:underline">
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-forest outline-none transition-colors placeholder:text-earth/50 focus:border-fresh"
      />
    </label>
  );
}