import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/sensors/types";

export function TrendChart({
  history,
  metric,
  label,
  color = "var(--fresh)",
}: {
  history: SensorReading[];
  metric: keyof Omit<SensorReading, "timestamp">;
  label: string;
  color?: string;
}) {
  const data = history.slice(-60).map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    value: r[metric],
  }));

  return (
    <div className="kg-card p-5">
      <p className="font-display text-sm font-semibold text-forest">{label}</p>
      <div className="mt-3 h-44">
        {data.length < 2 ? (
          <p className="grid h-full place-items-center text-xs text-muted-foreground">Collecting readings…</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -18, right: 4, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`g-${String(metric)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--mint)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" stroke="var(--earth)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--earth)" domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--mint)", fontSize: 12 }}
                labelStyle={{ color: "var(--earth)" }}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#g-${String(metric)})`} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}