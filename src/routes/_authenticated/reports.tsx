import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { TrendChart } from "@/components/kg/TrendChart";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { computeHealthScore, runDecisionEngine } from "@/lib/ai/engine";
import { fetchWeather } from "@/lib/weather";
import { SENSOR_META, type SensorKey } from "@/lib/sensors/types";

export const Route = createFileRoute("/_authenticated/reports")({
  component: Reports;
});

const KEYS: SensorKey[] = [
  "soilMoisture",
  "soilPH",
  "nitrogen",
  "phosphorus",
  "potassium",
  "temperature",
  "humidity",
  "waterLevel",
];

function Reports() {
  const { reading, history } = useSensors();
  const { data: weather } = useQuery({ queryKey: ["weather"], queryFn: fetchWeather });
  const score = computeHealthScore(reading, weather ?? null);
  const recs = runDecisionEngine(reading, weather ?? null);

  function exportCsv() {
    const header = ["timestamp", ...KEYS].join(",");
    const rows = history.map((r) => [r.timestamp, ...KEYS.map((k) => r[k])].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `krishi-guard-readings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const avg = (key: SensorKey) =>
    history.length ? (history.reduce((s, r) => s + r[key], 0) / history.length).toFixed(1) : "--";

  return (
    <AppShell title="Reports & Analytics" subtitle="Session averages, trends and exportable sensor logs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="kg-card flex-1 p-5">
          <p className="text-xs uppercase tracking-wide text-earth">Farm health score</p>
          <p className="mt-1 font-display text-3xl font-bold text-forest">
            {score.total}/100 <span className="text-sm font-medium text-agri">{score.label}</span>
          </p>
          <p className="mt-1 text-xs text-earth">{history.length} readings in this session</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={history.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Session averages</h2>
      <div className="kg-card mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mint/60 text-left text-xs uppercase tracking-wide text-earth">
            <tr>
              <th className="px-4 py-3">Sensor</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Healthy range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10">
            {KEYS.map((k) => (
              <tr key={k}>
                <td className="px-4 py-3 font-medium text-forest">{SENSOR_META[k].label}</td>
                <td className="px-4 py-3 text-forest">
                  {reading ? reading[k] : "--"} {SENSOR_META[k].unit}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{avg(k)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {SENSOR_META[k].optimal[0]} – {SENSOR_META[k].optimal[1]} {SENSOR_META[k].unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TrendChart history={history} metric="soilMoisture" label="Soil moisture (%)" />
        <TrendChart history={history} metric="potassium" label="Potassium (mg/kg)" color="var(--agri)" />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Actions suggested this session</h2>
      <ul className="kg-card mt-4 divide-y divide-forest/10">
        {recs.map((r) => (
          <li key={r.id} className="flex items-start gap-3 p-4 text-sm">
            <span aria-hidden>{r.icon}</span>
            <span>
              <span className="block font-semibold text-forest">{r.title}</span>
              <span className="block text-muted-foreground">{r.whatToDo}</span>
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}