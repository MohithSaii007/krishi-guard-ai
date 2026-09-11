import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2, Headphones, LockKeyhole, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { MarketplaceHeader } from "@/components/domains/MarketplaceHeader";
import { DomainBrand } from "@/components/domains/DomainBrand";
import { supabase } from "@/integrations/supabase/client";
import { useDomainCart, type CartDomain } from "@/lib/domains/cart";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "DomainNest — Find the Perfect Domain for Your Next Idea" },
    { name: "description", content: "Search domain names with transparent registration and renewal pricing, then manage every domain from one simple dashboard." },
    { property: "og:title", content: "DomainNest — Your next idea starts here" },
    { property: "og:description", content: "Find a memorable domain with transparent pricing and simple management." },
  ] }),
  component: MarketplaceHome,
});

type Product = { extension: string; registration_price: number; renewal_price: number; currency: string };
const FALLBACK_PRODUCTS: Product[] = [
  { extension: ".com", registration_price: 12.99, renewal_price: 17.99, currency: "USD" },
  { extension: ".in", registration_price: 8.99, renewal_price: 11.99, currency: "USD" },
  { extension: ".co", registration_price: 24.99, renewal_price: 29.99, currency: "USD" },
  { extension: ".org", registration_price: 10.99, renewal_price: 16.99, currency: "USD" },
  { extension: ".net", registration_price: 13.99, renewal_price: 18.99, currency: "USD" },
  { extension: ".ai", registration_price: 79.99, renewal_price: 89.99, currency: "USD" },
];

function cleanDomain(value: string) {
  return value.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]?.replace(/[^a-z0-9.-]/g, "") ?? "";
}

function MarketplaceHome() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const { add, remove, has } = useDomainCart();
  const { data: products = FALLBACK_PRODUCTS } = useQuery({
    queryKey: ["domain-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("domain_products").select("extension,registration_price,renewal_price,currency").eq("is_active", true).order("registration_price");
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const results = useMemo(() => {
    if (!query) return [];
    const normalized = cleanDomain(query);
    const label = normalized.includes(".") ? normalized.slice(0, normalized.lastIndexOf(".")) : normalized;
    const preferredExtension = normalized.includes(".") ? `.${normalized.split(".").pop()}` : ".com";
    return [...products].sort((a, b) => a.extension === preferredExtension ? -1 : b.extension === preferredExtension ? 1 : 0).map((product, index) => ({
      ...product,
      domain: `${label || "youridea"}${product.extension}`,
      recommended: index === 0,
    }));
  }, [products, query]);

  function search(event: FormEvent) {
    event.preventDefault();
    const value = cleanDomain(input);
    if (value) setQuery(value);
  }

  function toggle(item: CartDomain) { has(item.name) ? remove(item.name) : add(item); }

  return <div className="min-h-screen bg-white text-slate-950">
    <MarketplaceHeader />
    <main>
      <section className="domain-hero relative overflow-hidden px-5 pb-24 pt-20 text-white sm:pb-28 sm:pt-24">
        <div className="domain-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur"><Sparkles className="size-3.5" /> Simple names. Serious ideas.</span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">Your next big idea deserves the <span className="domain-shimmer">perfect domain.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">Search memorable names, see honest renewal pricing, and manage everything from one beautifully simple dashboard.</p>
          <form onSubmit={search} className="mx-auto mt-9 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-indigo-950/40 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3"><Search className="size-5 shrink-0 text-slate-400" /><span className="sr-only">Search for a domain</span><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter your idea or domain" className="h-12 w-full bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400" autoComplete="off" /></label>
            <button type="submit" className="h-12 rounded-xl bg-indigo-600 px-7 text-sm font-bold text-white transition hover:bg-indigo-500">Search domains</button>
          </form>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-400" />No hidden fees</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-400" />Renewal prices upfront</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-emerald-400" />Secure checkout</span></div>
        </div>
      </section>

      {query && <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-5" aria-live="polite">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Search results</p><h2 className="mt-1 font-display text-2xl font-bold">Names for “{query}”</h2></div><p className="text-xs text-slate-500">Availability is confirmed before payment.</p></div>
          <div className="mt-6 space-y-3">{results.map((result) => {
            const selected = has(result.domain);
            return <article key={result.domain} className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${result.recommended ? "border-indigo-200 bg-indigo-50/60" : "border-slate-200 hover:border-indigo-200"}`}>
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-lg font-bold">{result.domain}</h3>{result.recommended && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Top pick</span>}</div><p className="text-xs text-emerald-700">Pricing preview</p></div></div>
              <div className="flex items-center justify-between gap-5 sm:justify-end"><div className="text-right"><p className="font-display text-xl font-bold">${Number(result.registration_price).toFixed(2)}<span className="text-xs font-normal text-slate-500"> / first year</span></p><p className="text-[11px] text-slate-400">Renews ${Number(result.renewal_price).toFixed(2)}/yr</p></div><button onClick={() => toggle({ name: result.domain, price: Number(result.registration_price), renewalPrice: Number(result.renewal_price), currency: result.currency })} className={`min-w-24 rounded-xl px-4 py-2.5 text-sm font-bold ${selected ? "bg-slate-100 text-slate-700" : "bg-slate-950 text-white hover:bg-indigo-600"}`}>{selected ? <span className="flex items-center justify-center gap-1"><X className="size-3.5" />Remove</span> : "Add to cart"}</button></div>
            </article>;
          })}</div>
        </div>
      </section>}

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Popular extensions</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight">A name for every ambition.</h2></div><button onClick={() => { setInput("mybrand"); setQuery("mybrand"); window.scrollTo({ top: 380, behavior: "smooth" }); }} className="flex items-center gap-1 text-sm font-bold text-indigo-600">Explore all domains <ArrowRight className="size-4" /></button></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((product) => <button key={product.extension} onClick={() => { setInput(`myidea${product.extension}`); setQuery(`myidea${product.extension}`); window.scrollTo({ top: 380, behavior: "smooth" }); }} className="group rounded-2xl border border-slate-200 p-6 text-left transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-950/5"><div className="flex items-start justify-between"><span className="font-display text-3xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600">{product.extension}</span><ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" /></div><p className="mt-8 text-sm text-slate-500">From <strong className="text-slate-900">${Number(product.registration_price).toFixed(2)}</strong> first year</p><p className="mt-1 text-xs text-slate-400">${Number(product.renewal_price).toFixed(2)} renewal</p></button>)}</div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-5 py-20"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Built for confidence</p><h2 className="mt-2 font-display text-3xl font-bold">Domains without the fine-print feeling.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[
        [ShieldCheck, "Transparent pricing", "Registration and renewal prices sit side by side, so future costs never surprise you."],
        [LockKeyhole, "Secure by design", "Your account data is protected with row-level access controls and secure authentication."],
        [Headphones, "Human-friendly control", "Manage domains, renewals and DNS in a dashboard designed for people, not specialists."],
      ].map(([Icon, title, description]) => { const FeatureIcon = Icon as typeof ShieldCheck; return <div key={String(title)} className="rounded-3xl border border-slate-200 bg-white p-7"><span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FeatureIcon className="size-5" /></span><h3 className="mt-5 font-display text-lg font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{String(description)}</p></div>; })}</div></div></section>

      <section className="px-5 py-20"><div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-indigo-600 px-6 py-12 text-center text-white shadow-2xl shadow-indigo-600/20 sm:px-12"><h2 className="font-display text-3xl font-bold sm:text-4xl">The right name is one search away.</h2><p className="mx-auto mt-3 max-w-xl text-sm text-indigo-100">Start with an idea. We’ll help you turn it into an address people remember.</p><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50">Find your domain</button></div></section>
    </main>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row"><DomainBrand /><p className="text-xs text-slate-400">Transparent domain registration and management.</p><div className="flex gap-5 text-xs font-medium text-slate-500"><Link to="/auth">Account</Link><Link to="/domains">My domains</Link></div></div></footer>
  </div>;
}