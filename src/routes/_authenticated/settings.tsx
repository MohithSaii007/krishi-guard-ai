import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/kg/AppShell";
import { useProfile, useUpdateProfile, type FarmerProfile } from "@/hooks/useProfile";
import { useSensors } from "@/lib/sensors/SensorProvider";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Settings,
});

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
];

function Settings() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const { mode, state, deviceName } = useSensors();
  const [form, setForm] = useState<Partial<FarmerProfile>>({});

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function set<K extends keyof FarmerProfile>(key: K, value: FarmerProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      await update.mutateAsync({ ...form, setup_complete: true });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save your profile");
    }
  }

  return (
    <AppShell title="Profile & Settings" subtitle="Your details, farm information and language preference">
      <form onSubmit={save} className="grid gap-4 lg:grid-cols-2">
        <section className="kg-card p-6">
          <h2 className="font-display text-lg font-semibold text-forest">Farmer details</h2>
          <div className="mt-4 space-y-3.5">
            <Field label="Full name" value={form.full_name ?? ""} onChange={(v) => set("full_name", v)} />
            <Field label="Mobile number" value={form.mobile ?? ""} onChange={(v) => set("mobile", v)} />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Village" value={form.village ?? ""} onChange={(v) => set("village", v)} />
              <Field label="District" value={form.district ?? ""} onChange={(v) => set("district", v)} />
            </div>
            <Field label="State" value={form.state ?? ""} onChange={(v) => set("state", v)} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">
                Preferred language
              </span>
              <select
                value={form.language ?? "en"}
                onChange={(e) => set("language", e.target.value)}
                className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-forest outline-none focus:border-fresh"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="kg-card p-6">
          <h2 className="font-display text-lg font-semibold text-forest">Farm information</h2>
          <div className="mt-4 space-y-3.5">
            <Field label="Farm name" value={form.farm_name ?? ""} onChange={(v) => set("farm_name", v)} />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Farm size" value={form.farm_size ?? ""} onChange={(v) => set("farm_size", v)} placeholder="3 acres" />
              <Field label="Soil type" value={form.soil_type ?? ""} onChange={(v) => set("soil_type", v)} placeholder="Red loam" />
            </div>
            <Field label="Main crop" value={form.main_crop ?? ""} onChange={(v) => set("main_crop", v)} placeholder="Groundnut" />
          </div>

          <div className="mt-6 rounded-xl bg-mint/60 p-4 text-sm">
            <p className="font-semibold text-forest">Sensor connection</p>
            <p className="mt-1 text-earth">
              Mode: {mode.toUpperCase()} · Status: {state} · Device: {deviceName ?? "none"}
            </p>
          </div>

          <button
            type="submit"
            disabled={update.isPending}
            className="mt-6 w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            Save changes
          </button>
        </section>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">{label}</span>
      <input
        value={value}
        maxLength={120}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-earth/50 focus:border-fresh"
      />
    </label>
  );
}