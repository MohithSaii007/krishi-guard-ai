import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/kg/AppShell";
import { Recommendations } from "@/components/kg/Recommendations";
import { fetchWeather } from "@/lib/weather";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { computeHealthScore } from "@/lib/ai/engine";

export const Route = createFileRoute("/_authenticated/insights")({
  component: Insights,
});

function Insights() {
  const { data: weather } = useQuery({ queryKey: ["weather"], queryFn: fetchWeather, refetchInterval: 600000 });
  const { reading } = useSensors();
  const score = computeHealthScore(reading, weather ?? null);

  return (
    <AppShell title="AI Insights" subtitle="What happened, why it happened, and what to do next">
      <section className="kg-card kg-soft-gradient p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-earth">Decision engine summary</p>
        <p className="mt-2 font-display text-2xl font-semibold text-forest">
          Field status: {score.label} ({score.total}/100)
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Recommendations below come from transparent agronomic rules applied to your live sensor values and the current
          weather outlook — not from a black-box model. Thresholds can be tuned per crop.
        </p>
      </section>

      <div className="mt-6">
        <Recommendations weather={weather ?? null} />
      </div>
    </AppShell>
  );
}