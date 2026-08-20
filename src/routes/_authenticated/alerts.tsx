import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BellRing, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { buildAlerts } from "@/lib/ai/engine";

export const Route = createFileRoute("/_authenticated/alerts")({
  component: Alerts,
});

const STYLE = {
  critical: { chip: "bg-danger/15 text-danger", icon: AlertTriangle, label: "Critical" },
  warning: { chip: "bg-amber-warn/20 text-earth", icon: BellRing, label: "Warning" },
  healthy: { chip: "bg-fresh/15 text-agri", icon: CheckCircle2, label: "Healthy" },
} as const;

function Alerts() {
  const { reading } = useSensors();
  const alerts = buildAlerts(reading);
  const order = { critical: 0, warning: 1, healthy: 2 } as const;
  const sorted = [...alerts].sort((a, b) => order[a.severity] - order[b.severity]);

  return (
    <AppShell title="Alerts & Notifications" subtitle="Every sensor channel checked against its healthy range">
      <div className="grid gap-3 sm:grid-cols-3">
        {(["critical", "warning", "healthy"] as const).map((sev) => (
          <div key={sev} className="kg-card p-5">
            <p className="text-xs uppercase tracking-wide text-earth">{STYLE[sev].label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-forest">
              {alerts.filter((a) => a.severity === sev).length}
            </p>
          </div>
        ))}
      </div>

      <div className="kg-card mt-6 divide-y divide-forest/10">
        {sorted.length === 0 && <p className="p-5 text-sm text-muted-foreground">No sensor data yet.</p>}
        {sorted.map((a) => {
          const s = STYLE[a.severity];
          const Icon = s.icon;
          return (
            <div key={a.title} className="flex items-start gap-3 p-4">
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${s.chip}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-forest">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.message}</p>
              </div>
              <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.chip}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}