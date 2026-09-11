import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CloudRain, CloudSun, Droplets, Thermometer, Wind } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { fetchWeather, weatherConfigured } from "@/lib/weather";

export const Route = createFileRoute("/_authenticated/weather")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Weather Intelligence — KRISHI-GUARD AI" },
      { name: "description", content: "Current field conditions and a 5-day outlook that feeds directly into every farming recommendation." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Weather Intelligence — KRISHI-GUARD AI" },
      { property: "og:description", content: "Current field conditions and a 5-day outlook that feeds directly into every farming recommendation." },
    ],
  }),
  component: Weather,
});

function Weather() {
  const { data, isLoading } = useQuery({ queryKey: ["weather"], queryFn: fetchWeather, refetchInterval: 600000 });

  return (
    <AppShell title="Weather Intelligence" subtitle="Current conditions and 5-day outlook for your field">
      <section className="kg-card kg-gradient p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Right now</p>
            <p className="mt-2 font-display text-5xl font-bold">{isLoading ? "--" : data?.temperature}°C</p>
            <p className="mt-1 text-sm text-white/85">{data?.condition ?? "Loading…"}</p>
          </div>
          <CloudSun className="size-16 text-white/70" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [Droplets, "Humidity", `${data?.humidity ?? "--"}%`],
            [CloudRain, "Rain chance", `${data?.rainProbability ?? "--"}%`],
            [Wind, "Wind", `${data?.windSpeed ?? "--"} km/h`],
            [Thermometer, "Source", data?.source === "live" ? "Live API" : "Demo data"],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Droplets;
            return (
              <div key={String(label)} className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <I className="size-4 text-white/70" />
                <p className="mt-2 text-[11px] uppercase tracking-wide text-white/70">{String(label)}</p>
                <p className="font-display text-base font-semibold">{String(value)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">5-day outlook</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(data?.forecast ?? []).map((d) => (
          <div key={d.day} className="kg-card kg-card-hover p-5">
            <p className="font-display text-sm font-semibold text-forest">{d.day}</p>
            <p className="mt-1 text-xs text-earth">{d.condition}</p>
            <p className="mt-3 font-display text-2xl font-bold text-forest">
              {d.high}° <span className="text-sm font-medium text-earth">/ {d.low}°</span>
            </p>
            <p className="mt-2 text-xs text-sky-700">Rain {d.rainProbability}%</p>
          </div>
        ))}
      </div>

      {!weatherConfigured && (
        <p className="mt-6 rounded-xl bg-mint/70 p-4 text-sm text-forest">
          Showing clearly-labelled demo weather. Add your weather API URL and key
          (<code className="rounded bg-white px-1">VITE_WEATHER_API_URL</code>,{" "}
          <code className="rounded bg-white px-1">VITE_WEATHER_API_KEY</code>) to switch this page to live data.
        </p>
      )}

      <section className="kg-card mt-6 p-5">
        <h3 className="font-display text-base font-semibold text-forest">Weather-based advisory</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {(data?.rainProbability ?? 0) >= 60
            ? "High rain probability — postpone irrigation and spraying, and check field drainage."
            : (data?.temperature ?? 0) > 35
              ? "High heat — irrigate early morning, use mulch and avoid mid-day spraying."
              : "Conditions are stable. Continue your normal irrigation and crop protection schedule."}
        </p>
      </section>
    </AppShell>
  );
}