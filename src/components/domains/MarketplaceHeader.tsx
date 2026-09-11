import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDomainCart } from "@/lib/domains/cart";
import { DomainBrand } from "./DomainBrand";
import { supabase } from "@/integrations/supabase/client";

export function MarketplaceHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const { items } = useDomainCart();
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);
  const links = [
    { label: "Find a domain", to: "/domainnest" as const },
    { label: "My domains", to: "/domains" as const },
    { label: "Orders", to: "/orders" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <DomainBrand />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((item) => <Link key={item.label} to={item.to} className="text-sm font-medium text-slate-600 hover:text-indigo-600">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-xl p-2.5 text-slate-700 hover:bg-slate-100" aria-label={`Cart with ${items.length} domains`}>
            <ShoppingCart className="size-5" />
            {items.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">{items.length}</span>}
          </Link>
          {signedIn ? <Link to="/domains" className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 sm:block">My account</Link> : <><Link to="/auth" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:block">Sign in</Link><Link to="/auth" search={{ mode: "signup" }} className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 sm:block">Create account</Link></>}
          <button onClick={() => setOpen((value) => !value)} className="rounded-xl p-2.5 md:hidden" aria-label="Toggle menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {open && <nav className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
        {links.map((item) => <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">{item.label}</Link>)}
        <Link to={signedIn ? "/domains" : "/auth"} className="mt-2 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">{signedIn ? "My account" : "Sign in or create account"}</Link>
      </nav>}
    </header>
  );
}