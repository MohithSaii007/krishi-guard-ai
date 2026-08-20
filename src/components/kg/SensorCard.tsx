import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SENSOR_META, statusOf, type SensorKey } from "@/lib/sensors/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  optimal: { chip: "bg-fresh/15 text-agri", label: "Optimal", bar: "bg-fresh" },
  warning: { chip: "bg-amber-warn/20 text-earth", label: "Warning", bar: "bg-amber-warn" },
  critical: { chip: "bg-danger/15 text-danger", label: "Critical", bar: "bg-danger" },
} as const;

export function SensorCard({
  sensorKey,
  value,
  previous,
  icon: Icon,
  updatedAt,
}: {
  sensorKey: SensorKey;
  value: number | null;
  previous?: number | null;
  icon: LucideIcon;
  updatedAt?: string | null;
}) {
  const meta = SENSOR_META[sensorKey];
  const status = statusOf(sensorKey, value);
  const styles = STATUS_STYLES[status];
  const delta = value != null && previous != null ? value - previous : 0;
  const Trend = delta > 0.05 ? ArrowUpRight : delta < -0.05 ? ArrowDownRight : ArrowRight;
  const pct = value == null ? 0 : Math.min(100, Math.max(4, (value / (meta.warn[1] || 100)) * 100));

  return (
    <div className="kg-card kg-card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-mint text-agri">
          <Icon className="size-5" />
        </span>
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", styles.chip)}>{styles.label}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-earth">{meta.label}</p>
      <p className="mt-1 flex items-baseline gap-1 font-display text-3xl font-semibold text-forest tabular-nums transition-all">
        {value == null ? "—" : value}
        <span className="text-sm font-medium text-muted-foreground">{meta.unit}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mint">
        <div className={cn("h-full rounded-full transition-all duration-700", styles.bar)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Trend className={cn("size-3", delta > 0 ? "text-fresh" : delta < 0 ? "text-amber-warn" : "text-muted-foreground")} />
          {delta === 0 ? "stable" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
        </span>
        <span>{updatedAt ? new Date(updatedAt).toLocaleTimeString() : "—"}</span>
      </div>
    </div>
  );
}