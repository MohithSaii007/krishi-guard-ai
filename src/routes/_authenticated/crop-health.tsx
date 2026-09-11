import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bug, Camera, Leaf, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/kg/AppShell";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { analyzeCropImage, type CropDiagnosis } from "@/lib/crop-vision.functions";

const SEVERITY_STYLE: Record<string, string> = {
  healthy: "bg-fresh/15 text-agri border-fresh/40",
  mild: "bg-mint text-agri border-fresh/30",
  moderate: "bg-amber-warn/15 text-earth border-amber-warn/40",
  severe: "bg-danger/15 text-danger border-danger/40",
  unknown: "bg-muted text-muted-foreground border-border",
};

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("Could not read that image."));
    fr.readAsDataURL(file);
  });
}


export const Route = createFileRoute("/_authenticated/crop-health")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Crop Health & Disease Check — KRISHI-GUARD AI" },
      { name: "description", content: "Upload a crop photo to identify the crop, spot disease or pest damage and get treatment and prevention steps." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Crop Health & Disease Check — KRISHI-GUARD AI" },
      { property: "og:description", content: "Upload a crop photo to identify the crop, spot disease or pest damage and get treatment and prevention steps." },
    ],
  }),
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
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [result, setResult] = useState<CropDiagnosis | null>(null);
  const analyze = useServerFn(analyzeCropImage);

  const runAnalysis = async () => {
    if (!dataUrl) return;
    setBusy(true);
    setAiError(null);
    setResult(null);
    try {
      const context = reading
        ? `soil moisture ${reading.soilMoisture}%, soil pH ${reading.soilPH}, N ${reading.nitrogen} mg/kg, P ${reading.phosphorus} mg/kg, K ${reading.potassium} mg/kg, temperature ${reading.temperature}C, humidity ${reading.humidity}%`
        : undefined;
      const diagnosis = await analyze({ data: { imageDataUrl: dataUrl, note: note || undefined, context } });
      setResult(diagnosis);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Photo check failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };


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
          Upload or capture a crop photo and get an instant read on the plant's current situation — crop, problem,
          severity and what to do now.
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
                if (!file) return;
                setPreview(URL.createObjectURL(file));
                setResult(null);
                setAiError(null);
                void readAsDataUrl(file)
                  .then(setDataUrl)
                  .catch((err: Error) => setAiError(err.message));
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
            <button
              onClick={() => void runAnalysis()}
              disabled={!dataUrl || busy}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {busy ? "Checking the photo…" : "Check crop condition"}
            </button>
            {aiError && (
              <p className="mt-3 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{aiError}</p>
            )}
          </div>
          <div className="grid place-items-center overflow-hidden rounded-2xl bg-mint/40">
            {preview ? (
              <img src={preview} alt="Uploaded crop leaf for inspection" className="size-full object-cover" />
            ) : (
              <p className="p-6 text-center text-xs text-earth">Your photo preview will appear here.</p>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-forest/15 bg-mint/30 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-semibold text-forest">{result.crop}</h3>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  SEVERITY_STYLE[result.severity] ?? SEVERITY_STYLE['unknown']
                }`}
              >
                {result.severity}
              </span>
              <span className="text-xs text-earth">Confidence {Math.round(result.confidence)}%</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-forest">{result.condition}</p>
            <p className="mt-2 text-sm text-muted-foreground">{result.situation}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["What is visible", result.symptoms],
                  ["Likely reasons", result.causes],
                  ["Do this now", result.actions],
                  ["Prevent next time", result.prevention],
                ] as [string, string[]][]
              )
                .filter(([, items]) => items.length > 0)
                .map(([title, items]) => (
                  <div key={title} className="rounded-xl bg-white/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-earth">{title}</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-forest">
                      {items.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-earth">
              This is guidance from a photo. For severe damage, confirm with your local agriculture officer before
              spraying.
            </p>
          </div>
        )}
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