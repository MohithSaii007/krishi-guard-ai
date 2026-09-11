import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/kg/Brand";

export const Route = createFileRoute("/reset-password")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Reset Password — KRISHI-GUARD AI" },
      { name: "description", content: "Set a new password for your KRISHI-GUARD AI farmer account." },
      { property: "og:title", content: "Reset Password — KRISHI-GUARD AI" },
      { property: "og:description", content: "Set a new password for your farmer account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) setError(err.message);
    else {
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <Brand />
        <h1 className="mt-6 font-display text-2xl font-semibold text-forest">Set a new password</h1>
        <form onSubmit={submit} className="mt-6 space-y-3.5">
          <input
            type="password"
            value={password}
            maxLength={72}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-forest outline-none focus:border-fresh"
          />
          {error && <p className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          {done && <p className="rounded-xl bg-fresh/15 p-3 text-sm text-agri">Password updated. Redirecting…</p>}
          <button className="w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}