import { useSensors } from "@/lib/sensors/SensorProvider";
import { runDecisionEngine, type RiskLevel } from "@/lib/ai/engine";
import type { WeatherSnapshot } from "@/lib/weather";
import { cn } from "@/lib/utils";

const RISK: Record<RiskLevel, string> = {
  HIGH: "bg-danger/15 text-danger border-danger/30",
  MODERATE: "bg-amber-warn/20 text-earth border-amber-warn/40",
  LOW: "bg-fresh/15 text-agri border-fresh/30",
};

export function Recommendations({ weather, limit }: { weather: WeatherSnapshot | null; limit?: number }) {
  const { reading } = useSensors();
  const items = runDecisionEngine(reading, weather).slice(0, limit ?? 99);

  if (items.length === 0) {
    return <p className="kg-card p-5 text-sm text-muted-foreground">Waiting for the first sensor reading…</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((r) => (
        <article key={r.id} className="kg-card kg-card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-forest">
              <span aria-hidden>{r.icon}</span>
              {r.title}
            </h3>
            <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", RISK[r.risk])}>
              {r.risk} RISK
            </span>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-earth">What happened</dt>
              <dd className="text-forest">{r.whatHappened}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-earth">Why</dt>
              <dd className="text-muted-foreground">{r.why}</dd>
            </div>
            <div className="rounded-xl bg-mint/70 p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-agri">What to do</dt>
              <dd className="text-forest">{r.whatToDo}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}