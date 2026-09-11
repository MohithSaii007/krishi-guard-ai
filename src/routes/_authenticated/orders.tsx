import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { DomainAccountShell } from "@/components/domains/DomainAccountShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/orders")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Orders — DomainNest" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user } = Route.useRouteContext();
  const { data = [], isLoading } = useQuery({
    queryKey: ["domain-orders", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("domain_orders").select("id,status,total_amount,currency,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  return <DomainAccountShell title="Orders" subtitle="Track domain purchases and registration progress.">
    {isLoading ? <div className="h-40 animate-pulse rounded-2xl bg-white" /> : data.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><ReceiptText className="mx-auto size-10 text-indigo-500" /><h2 className="mt-4 font-bold text-slate-950">No orders yet</h2><p className="mt-2 text-sm text-slate-500">Completed and pending purchases will be listed here.</p></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">{data.map((order) => <div key={order.id} className="flex items-center justify-between border-b border-slate-100 p-5 last:border-0"><div><p className="font-semibold text-slate-900">Order {order.id.slice(0, 8).toUpperCase()}</p><p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p></div><div className="text-right"><p className="font-bold text-slate-900">${Number(order.total_amount).toFixed(2)}</p><p className="text-xs capitalize text-indigo-600">{order.status.replace("_", " ")}</p></div></div>)}</div>}
  </DomainAccountShell>;
}