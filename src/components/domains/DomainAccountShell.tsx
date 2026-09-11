import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CreditCard, Globe2, LogOut, Search, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { DomainBrand } from "./DomainBrand";
import { useDomainCart } from "@/lib/domains/cart";

const NAV = [
  { to: "/domains" as const, label: "My domains", icon: Globe2 },
  { to: "/orders" as const, label: "Orders", icon: CreditCard },
];

export function DomainAccountShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { items } = useDomainCart();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return <div className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <DomainBrand />
        <div className="flex items-center gap-1">
          <Link to="/domainnest" className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100" aria-label="Search domains"><Search className="size-5" /></Link>
          <Link to="/cart" className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100" aria-label="Shopping cart"><ShoppingCart className="size-5" />{items.length > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-indigo-600 text-[9px] text-white">{items.length}</span>}</Link>
          <button onClick={() => void signOut()} className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100" aria-label="Sign out"><LogOut className="size-5" /></button>
        </div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[220px_1fr]">
      <aside><nav className="flex gap-2 md:flex-col">{NAV.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold", pathname === to ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" : "text-slate-600 hover:bg-white")}><Icon className="size-4" />{label}</Link>)}</nav></aside>
      <main>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </main>
    </div>
  </div>;
}