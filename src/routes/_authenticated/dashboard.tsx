import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, CloudSun, Droplets, Leaf } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { SensorGrid } from "@/components/kg/SensorGrid";
import { Recommendations } from "@/components/kg/Recommendations";
import { TrendChart } from "@/components/kg/TrendChart";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { computeHealthScore } from "@/lib/ai/engine";
import { fetchWeather } from "@/lib/weather";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/dashboard")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Farm Dashboard — KRISHI-GUARD AI" },
      { name: "description", content: "Live farm health score, sensor readings, weather snapshot and AI recommendations for your field in one dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Farm Dashboard — KRISHI-GUARD AI" },
      { property: "og:description", content: "Live farm health score, sensor readings, weather snapshot and AI recommendations for your field in one dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { reading, history } = useSensors();
  const { data: profile } = useProfile();
  const { data: weather } = useQuery({ queryKey: ["weather"], queryFn: fetchWeather, refetchInterval: 600000 });
  const score = computeHealthScore(reading, weather ?? null);

  return (
    <AppShell
      title={`Namaste, ${profile?.full_name?.split(" ")[0] ?? "Farmer"}`}
      subtitle={`${profile?.farm_name ?? "My Farm"} · ${profile?.main_crop ?? "Crop not set"}`}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="kg-card kg-leaf-pattern p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-earth">Farm Health Score</p>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <p className="font-display text-5xl font-bold text-forest">
              {score.total}
              <span className="text-xl text-earth">/100</span>
            </p>
            <span className="rounded-full bg-fresh/15 px-3 py-1 text-sm font-semibold text-agri">{score.label}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ["Soil", score.soil],
              ["Water", score.water],
              ["Crop", score.crop],
              ["Weather", score.weather],
              ["Nutrients", score.nutrients],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl bg-white/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-earth">{label}</p>
                <p className="mt-1 font-display text-lg font-semibold text-forest">{value}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mint">
                  <div className="h-full rounded-full bg-fresh" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="kg-card p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-earth">
            <CloudSun className="size-4" /> Weather Now
          </p>
          <p className="mt-3 font-display text-4xl font-bold text-forest">{weather?.temperature ?? "--"}°C</p>
          <p className="text-sm text-muted-foreground">{weather?.condition ?? "Loading…"}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Humidity" value={`${weather?.humidity ?? "--"}%`} />
            <Row label="Rain chance" value={`${weather?.rainProbability ?? "--"}%`} />
            <Row label="Wind" value={`${weather?.windSpeed ?? "--"} km/h`} />
          </dl>
          <Link to="/weather" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-agri hover:underline">
            5-day forecast <ArrowRight className="size-3.5" />
          </Link>
        </section>
      </div>

      <h2 className="mt-8 flex items-center gap-2 font-display text-lg font-semibold text-forest">
        <Activity className="size-4" /> Live Sensor Readings
      </h2>
      <div className="mt-4">
        <SensorGrid />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendChart history={history} metric="soilMoisture" label="Soil moisture trend (%)" />
        <TrendChart history={history} metric="temperature" label="Temperature trend (°C)" color="var(--amber-warn)" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-forest">
          <Leaf className="size-4" /> AI Recommendations
        </h2>
        <Link to="/insights" className="text-sm font-medium text-agri hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4">
        <Recommendations weather={weather ?? null} limit={4} />
      </div>

      <Link
        to="/irrigation"
        className="mt-6 flex items-center justify-between rounded-2xl kg-gradient p-5 text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-3">
          <Droplets className="size-6" />
          <span>
            <span className="block font-display font-semibold">Smart Irrigation Control</span>
            <span className="block text-xs text-white/80">Check whether your field needs water right now</span>
          </span>
        </span>
        <ArrowRight className="size-5" />
      </Link>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-earth">{label}</dt>
      <dd className="font-semibold text-forest">{value}</dd>
    </div>
  );
}