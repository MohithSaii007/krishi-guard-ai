import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LockKeyhole, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { MarketplaceHeader } from "@/components/domains/MarketplaceHeader";
import { useDomainCart } from "@/lib/domains/cart";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Your Cart — DomainNest" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove } = useDomainCart();
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  useEffect(() => { void supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session))); }, []);
  return <div className="min-h-screen bg-slate-50">
    <MarketplaceHeader />
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"><ArrowLeft className="size-4" />Continue searching</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section><h1 className="font-display text-3xl font-bold text-slate-950">Your domain cart</h1><p className="mt-2 text-sm text-slate-500">Review your names before secure checkout.</p>
          <div className="mt-6 space-y-3">{items.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><ShoppingBag className="mx-auto size-10 text-slate-300" /><h2 className="mt-4 font-bold text-slate-900">Your cart is empty</h2><p className="mt-2 text-sm text-slate-500">Search for a domain and add it here.</p></div> : items.map((item) => <article key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="font-display text-lg font-bold text-slate-950">{item.name}</h2><p className="mt-1 text-xs text-slate-500">1 year registration · Renews at ${item.renewalPrice.toFixed(2)}/yr</p></div><div className="flex items-center gap-4"><span className="font-bold text-slate-950">${item.price.toFixed(2)}</span><button onClick={() => remove(item.name)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button></div></article>)}</div>
        </section>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-display text-xl font-bold text-slate-950">Order summary</h2><div className="mt-5 flex justify-between text-sm text-slate-600"><span>Domains ({items.length})</span><span>${subtotal.toFixed(2)}</span></div><div className="my-5 h-px bg-slate-100" /><div className="flex items-end justify-between"><span className="font-semibold text-slate-900">Total</span><span className="font-display text-2xl font-bold text-slate-950">${subtotal.toFixed(2)}</span></div><p className="mt-1 text-right text-xs text-slate-400">USD · Taxes calculated later</p>
          <button onClick={() => navigate(signedIn ? { to: "/orders" } : { to: "/auth", search: { mode: "signup" } })} disabled={!items.length} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400"><LockKeyhole className="size-4" />{signedIn ? "Continue to checkout" : "Sign in to checkout"}</button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="size-4 text-emerald-500" />Availability rechecked before payment</p>
        </aside>
      </div>
    </main>
  </div>;
}