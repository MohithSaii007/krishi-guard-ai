import { createFileRoute } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import fieldImg from "@/assets/aerial-field.jpg";
import techImg from "@/assets/smart-farm-tech.jpg";

export const Route = createFileRoute("/_authenticated/drone")({
  component: Drone,
});

const LAYERS = [
  { name: "NDVI vigour map", status: "Awaiting survey", note: "Highlights weak growth zones before they are visible." },
  { name: "Thermal stress map", status: "Awaiting survey", note: "Finds water-stressed patches by canopy temperature." },
  { name: "Weed detection", status: "Awaiting survey", note: "Marks weed clusters for spot spraying." },
  { name: "Crop stand count", status: "Awaiting survey", note: "Estimates plant population per zone." },
];

function Drone() {
  return (
    <AppShell title="Drone & Field Monitoring" subtitle="Aerial survey layers for large-field decision making">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="kg-card overflow-hidden">
          <img src={fieldImg} alt="Aerial drone view of farm field blocks" className="h-64 w-full object-cover" />
          <div className="p-5">
            <p className="flex items-center gap-2 font-display text-base font-semibold text-forest">
              <Plane className="size-4" /> Latest field imagery
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Reference imagery shown. Upload your drone survey exports (GeoTIFF or JPEG tiles) and these panels switch to
              your own field.
            </p>
          </div>
        </section>
        <section className="kg-card overflow-hidden">
          <img src={techImg} alt="Smart farming sensor hardware in a field" className="h-64 w-full object-cover" />
          <div className="p-5">
            <p className="font-display text-base font-semibold text-forest">Ground truth pairing</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Drone layers are strongest when paired with ground sensors — the platform already stores both against the same
              farm profile.
            </p>
          </div>
        </section>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Analysis layers</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LAYERS.map((l) => (
          <div key={l.name} className="kg-card kg-card-hover p-5">
            <p className="font-display text-base font-semibold text-forest">{l.name}</p>
            <span className="mt-2 inline-block rounded-full bg-amber-warn/20 px-2.5 py-0.5 text-[11px] font-semibold text-earth">
              {l.status}
            </span>
            <p className="mt-2 text-xs text-muted-foreground">{l.note}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}