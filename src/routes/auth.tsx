import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { DomainBrand } from "@/components/domains/DomainBrand";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { mode?: "login" | "signup" } => ({
    ...(search['mode'] === "signup" ? { mode: "signup" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Sign in or Create an Account — DomainNest" },
      {
        name: "description",
        content:
          "Create your DomainNest account or sign in to manage domains, orders, renewals and DNS.",
      },
      { property: "og:title", content: "Sign in — DomainNest" },
      { property: "og:description", content: "Sign in to manage your domains." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [useOtp, setUseOtp] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
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
      if (mounted && data.session) navigate({ to: "/domains", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/domains", replace: true });
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
        if (!otpSent) {
          const { error: err } = await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
              data: { full_name: fullName.trim(), mobile: mobile.trim(), village: village.trim() },
            },
          });
          if (err) throw err;
          setOtpSent(true);
          setMessage("OTP sent to your email. Enter the 6-digit code to create your account.");
        } else {
          if (otp.trim().length !== 6) throw new Error("Enter the 6-digit OTP.");
          const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type: "email" });
          if (err) throw err;
        }
      } else if (useOtp) {
        if (!otpSent) {
          const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim() });
          if (err) throw err;
          setOtpSent(true);
          setMessage("OTP sent to your email. Enter the 6-digit code below.");
        } else {
          if (otp.trim().length !== 6) throw new Error("Enter the 6-digit OTP.");
          const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type: "email" });
          if (err) throw err;
        }
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
    navigate({ to: "/domains", replace: true });
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
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-32 right-0 size-[28rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <Globe2 className="size-9 text-indigo-300" />
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">
            Everything your domain needs, in one place.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Find the right name, register securely, manage renewals and control DNS without the usual complexity.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="inline-block">
              <DomainBrand />
            </Link>
          </div>
          <h1 className="mt-8 font-display text-2xl font-semibold text-forest">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-earth">
            {isSignup ? "Save your searches and manage every domain in one place." : "Sign in to manage your domains and orders."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            {isSignup && (
              <>
                <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Ramesh Kumar" required maxLength={80} />
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field label="Mobile number" value={mobile} onChange={setMobile} placeholder="98765 43210" maxLength={15} />
                  <Field label="City / Town" value={village} onChange={setVillage} placeholder="Bengaluru" maxLength={60} />
                </div>
              </>
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setOtpSent(false); setOtp(""); }}
              placeholder="farmer@example.com"
              required
              maxLength={255}
            />
            {!isSignup && !useOtp && (
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Your password"
                required
                maxLength={72}
              />
            )}
            {(useOtp || isSignup) && otpSent && (
              <Field label="6-digit OTP" value={otp} onChange={setOtp} placeholder="123456" required maxLength={6} />
            )}

            {error && <p className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
            {message && <p className="rounded-xl bg-fresh/15 p-3 text-sm text-agri">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isSignup ? (otpSent ? "Verify OTP & Create account" : "Send OTP") : useOtp ? (otpSent ? "Verify OTP & Sign in" : "Send OTP") : "Sign in"}
            </button>

            {!isSignup && (
              <button
                type="button"
                onClick={() => { setUseOtp((v) => !v); setOtpSent(false); setOtp(""); setError(null); setMessage(null); }}
                className="w-full text-center text-sm font-medium text-agri hover:underline"
              >
                {useOtp ? "Sign in with password instead" : "Sign in with OTP instead (no password needed)"}
              </button>
            )}
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
            <button onClick={() => { setIsSignup((v) => !v); setOtpSent(false); setOtp(""); setError(null); setMessage(null); }} className="font-medium text-agri hover:underline">
              {isSignup ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
            {!isSignup && !useOtp && (
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