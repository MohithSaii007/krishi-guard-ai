import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bug, Camera, Leaf, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { useSensors } from "@/lib/sensors/SensorProvider";

export const Route = createFileRoute("/_authenticated/crop-health")({
  component: CropHealth,
});

const PESTS = [
  { name: "Leaf blight", risk: "Moderate", cue: "Warm, humid nights above 85% humidity" },
  { name: "Aphid infestation", risk: "Low", cue: "Dry spells with new tender growth" },
  { name: "Stem borer", risk: "Low", cue: "Dense canopy and standing water" },
  { name: "Powdery mildew", risk: "Moderate", cue: "Cool mornings after humid nights" },
];

function CropHealth() {
  const { reading } = useSensors();
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const diseaseRisk =
    reading && reading.humidity > 85 && reading.temperature > 24
      ? { level: "HIGH", text: "Warm and very humid — fungal leaf disease conditions are present." }
      : reading && reading.humidity > 75
        ? { level: "MODERATE", text: "Humidity is climbing. Inspect lower leaves every two days." }
        : { level: "LOW", text: "Current field conditions do not favour fungal outbreaks." };

  return (
    <AppShell title="Crop Health & Protection" subtitle="Disease risk, pest watchlist and photo-based inspection">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="kg-card p-6 lg:col-span-2">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-earth">
            <Bug className="size-4" /> Disease risk from live conditions
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-forest">{diseaseRisk.level} RISK</h2>
          <p className="mt-2 text-sm text-muted-foreground">{diseaseRisk.text}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Humidity", `${reading?.humidity ?? "--"}%`],
              ["Temperature", `${reading?.temperature ?? "--"}°C`],
              ["Soil moisture", `${reading?.soilMoisture ?? "--"}%`],
              ["Nitrogen", `${reading?.nitrogen ?? "--"} mg/kg`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-mint/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-earth">{l}</p>
                <p className="mt-1 font-display text-base font-semibold text-forest">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="kg-card p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-earth">
            <ShieldCheck className="size-4" /> Protection checklist
          </p>
          <ul className="mt-3 space-y-2 text-sm text-forest">
            <li>· Scout 10 random plants per zone twice a week.</li>
            <li>· Remove and burn infected leaves, do not compost them.</li>
            <li>· Keep a preventive bio-fungicide ready during humid spells.</li>
            <li>· Avoid spraying in peak afternoon heat.</li>
          </ul>
        </section>
      </div>

      <section className="kg-card mt-6 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-forest">
          <Camera className="size-4" /> Photo inspection
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture an affected leaf and log what you observe. Images stay on your device until a trained disease-detection
          model is connected.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-forest/20 bg-mint/40 p-8 text-sm font-medium text-forest hover:bg-mint"
            >
              Upload or capture crop photo
            </button>
            <textarea
              value={note}
              maxLength={500}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what you see: yellow spots on lower leaves, curled tips…"
              className="mt-3 h-24 w-full rounded-xl border border-forest/15 bg-white p-3 text-sm text-forest outline-none focus:border-fresh"
            />
          </div>
          <div className="grid place-items-center overflow-hidden rounded-2xl bg-mint/40">
            {preview ? (
              <img src={preview} alt="Uploaded crop leaf for inspection" className="size-full object-cover" />
            ) : (
              <p className="p-6 text-center text-xs text-earth">Your photo preview will appear here.</p>
            )}
          </div>
        </div>
      </section>

      <h2 className="mt-8 flex items-center gap-2 font-display text-lg font-semibold text-forest">
        <Leaf className="size-4" /> Pest & disease watchlist
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PESTS.map((p) => (
          <div key={p.name} className="kg-card kg-card-hover p-5">
            <p className="font-display text-base font-semibold text-forest">{p.name}</p>
            <p className="mt-1 text-xs font-semibold text-earth">{p.risk} risk</p>
            <p className="mt-2 text-xs text-muted-foreground">{p.cue}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}