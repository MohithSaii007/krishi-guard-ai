import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Globe2, Plus } from "lucide-react";
import { DomainAccountShell } from "@/components/domains/DomainAccountShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/domains")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "My Domains — DomainNest" }, { name: "robots", content: "noindex" }] }),
  component: DomainsPage,
});

function DomainsPage() {
  const { user } = Route.useRouteContext();
  const { data = [], isLoading } = useQuery({
    queryKey: ["customer-domains", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("customer_domains").select("id,domain_name,status,expires_at,auto_renew").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return <DomainAccountShell title="My domains" subtitle="Manage registrations, renewals and DNS from one place.">
    {isLoading ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : data.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Globe2 className="size-7" /></span>
      <h2 className="mt-4 text-lg font-bold text-slate-950">No domains yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Find a name for your next idea. Your registered domains will appear here after checkout.</p>
      <Link to="/domainnest" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"><Plus className="size-4" />Find a domain</Link>
    </div> : <div className="grid gap-4">{data.map((domain) => <article key={domain.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-lg font-bold text-slate-950">{domain.domain_name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="size-3.5" />{domain.expires_at ? `Renews ${new Date(domain.expires_at).toLocaleDateString()}` : "Registration pending"}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700">{domain.status}</span></div>
    </article>)}</div>}
  </DomainAccountShell>;
}