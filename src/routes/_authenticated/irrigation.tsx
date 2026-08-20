import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Waves } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/kg/AppShell";
import { TrendChart } from "@/components/kg/TrendChart";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { fetchWeather } from "@/lib/weather";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/irrigation")({
  component: Irrigation,
});

interface IrrigationEvent {
  id: string;
  action: string;
  note: string | null;
  soil_moisture: number | null;
  created_at: string;
}

function Irrigation() {
  const { reading, history } = useSensors();
  const { data: weather } = useQuery({ queryKey: ["weather"], queryFn: fetchWeather });
  const qc = useQueryClient();

  const events = useQuery({
    queryKey: ["irrigation_events"],
    queryFn: async (): Promise<IrrigationEvent[]> => {
      const { data, error } = await supabase
        .from("irrigation_events")
        .select("id, action, note, soil_moisture, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as IrrigationEvent[];
    },
  });

  const log = useMutation({
    mutationFn: async (action: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not signed in");
      const { error } = await supabase.from("irrigation_events").insert({
        user_id: auth.user.id,
        action,
        soil_moisture: reading?.soilMoisture ?? null,
        note: `Rain chance ${weather?.rainProbability ?? "?"}%`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Irrigation action recorded");
      void qc.invalidateQueries({ queryKey: ["irrigation_events"] });
    },
    onError: () => toast.error("Could not record the action"),
  });

  const moisture = reading?.soilMoisture ?? null;
  const rain = weather?.rainProbability ?? 0;
  const decision =
    moisture == null
      ? { title: "Waiting for sensor data", tone: "bg-mint text-forest", body: "Connect a sensor or stay in demo mode to see a decision." }
      : moisture < 25 && rain < 40
        ? { title: "Irrigate now", tone: "bg-danger/15 text-danger", body: `Soil is dry at ${moisture}% and rain chance is only ${rain}%.` }
        : rain >= 60
          ? { title: "Wait — rain expected", tone: "bg-sky/20 text-forest", body: `Rain probability is ${rain}%. Save water and irrigate later if needed.` }
          : { title: "No irrigation needed", tone: "bg-fresh/15 text-agri", body: `Soil moisture is comfortable at ${moisture}%.` };

  return (
    <AppShell title="Smart Irrigation" subtitle="Moisture, water storage and rainfall combined into one decision">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`kg-card p-6 lg:col-span-2 ${decision.tone}`}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Irrigation decision</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">{decision.title}</h2>
          <p className="mt-2 text-sm opacity-90">{decision.body}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => log.mutate("Irrigated field")}
              disabled={log.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              <Droplets className="size-4" /> Mark as irrigated
            </button>
            <button
              onClick={() => log.mutate("Skipped irrigation")}
              disabled={log.isPending}
              className="rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-sm font-medium text-forest hover:bg-mint disabled:opacity-60"
            >
              Skipped this cycle
            </button>
          </div>
        </section>

        <section className="kg-card p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-earth">
            <Waves className="size-4" /> Water storage
          </p>
          <p className="mt-3 font-display text-4xl font-bold text-forest">{reading?.waterLevel ?? "--"}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-mint">
            <div className="h-full rounded-full bg-sky" style={{ width: `${reading?.waterLevel ?? 0}%` }} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Refill storage below 25% so the next irrigation cycle is not interrupted.
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendChart history={history} metric="soilMoisture" label="Soil moisture (%)" />
        <TrendChart history={history} metric="waterLevel" label="Water level (%)" color="var(--sky)" />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Irrigation history</h2>
      <div className="kg-card mt-4 divide-y divide-forest/10">
        {events.isLoading && <p className="p-5 text-sm text-muted-foreground">Loading history…</p>}
        {events.data?.length === 0 && <p className="p-5 text-sm text-muted-foreground">No irrigation actions recorded yet.</p>}
        {events.data?.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold text-forest">{e.action}</p>
              <p className="text-xs text-earth">
                {new Date(e.created_at).toLocaleString()} · Moisture {e.soil_moisture ?? "--"}% · {e.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}