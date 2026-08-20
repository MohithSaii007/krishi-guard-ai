import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { SensorGrid } from "@/components/kg/SensorGrid";
import { TrendChart } from "@/components/kg/TrendChart";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { useProfile } from "@/hooks/useProfile";
import fieldImg from "@/assets/aerial-field.jpg";

export const Route = createFileRoute("/_authenticated/monitoring")({
  component: Monitoring,
});

const ZONES = [
  { name: "Zone A — North block", crop: "Groundnut", status: "Healthy" },
  { name: "Zone B — Canal side", crop: "Paddy", status: "Watch" },
  { name: "Zone C — Upper slope", crop: "Tomato", status: "Healthy" },
];

function Monitoring() {
  const { history } = useSensors();
  const { data: profile } = useProfile();

  return (
    <AppShell title="Farm Monitoring" subtitle="Field zones, live readings and historical trends">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="kg-card overflow-hidden lg:col-span-2">
          <img src={fieldImg} alt="Aerial view of the monitored farm field" className="h-56 w-full object-cover" />
          <div className="p-5">
            <p className="flex items-center gap-1.5 text-sm text-earth">
              <MapPin className="size-4" />
              {[profile?.village, profile?.district, profile?.state].filter(Boolean).join(", ") || "Field location not set"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Field size: {profile?.farm_size || "not set"} · Soil: {profile?.soil_type || "not set"} · Main crop:{" "}
              {profile?.main_crop || "not set"}
            </p>
          </div>
        </section>
        <section className="kg-card p-5">
          <h2 className="font-display text-base font-semibold text-forest">Field Zones</h2>
          <ul className="mt-3 space-y-2">
            {ZONES.map((z) => (
              <li key={z.name} className="rounded-xl bg-mint/60 p-3">
                <p className="text-sm font-semibold text-forest">{z.name}</p>
                <p className="text-xs text-earth">
                  {z.crop} · {z.status}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-earth">
            Zone mapping is a template until your per-zone sensor nodes are registered.
          </p>
        </section>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Current readings</h2>
      <div className="mt-4">
        <SensorGrid />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Historical trends</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TrendChart history={history} metric="soilMoisture" label="Soil moisture (%)" />
        <TrendChart history={history} metric="soilPH" label="Soil pH" color="var(--earth)" />
        <TrendChart history={history} metric="nitrogen" label="Nitrogen (mg/kg)" color="var(--agri)" />
        <TrendChart history={history} metric="humidity" label="Humidity (%)" color="var(--sky)" />
      </div>
    </AppShell>
  );
}