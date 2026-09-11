import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Bug, CloudSun, Droplets, Leaf, Plane, Radio, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/kg/Brand";
import heroImg from "@/assets/hero-farmer.jpg";
import fieldImg from "@/assets/aerial-field.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "KRISHI-GUARD AI — Smart Crop Protection & Decision Support" },
      {
        name: "description",
        content:
          "AI-powered smart farming platform combining soil, weather, crop and field sensor data into simple, actionable recommendations for farmers.",
      },
      { property: "og:title", content: "KRISHI-GUARD AI — Smart Crop Protection" },
      {
        property: "og:description",
        content: "Intelligent farming. Better decisions. Healthier crops. Works in Demo Mode today, real sensors tomorrow.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Radio,
    title: "Smart Sensors",
    body: "Soil moisture, pH, NPK, temperature, humidity and water level from ESP32, Raspberry Pi or BLE field nodes.",
  },
  {
    icon: Bot,
    title: "AI Recommendations",
    body: "A transparent decision engine turns raw readings into plain-language actions: what happened, why, what to do.",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    body: "Moisture, water level and rainfall probability combine into a single irrigate-or-wait decision.",
  },
  {
    icon: Bug,
    title: "Crop Health",
    body: "Upload a crop photo and log the issue, ready for a trained disease model to be connected.",
  },
  {
    icon: Plane,
    title: "Drone & Field Monitoring",
    body: "Field zones today, NDVI and multispectral drone layers when your survey data arrives.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    body: "Current conditions and a 5-day outlook feeding straight into every recommendation.",
  },
];

const STEPS = [
  { n: "01", t: "Data Collection", d: "Field sensors stream soil, water and climate readings." },
  { n: "02", t: "AI Analysis", d: "Rules evaluate every value against agronomic thresholds." },
  { n: "03", t: "Risk Detection", d: "Water stress, heat stress, nutrient and disease risks are scored." },
  { n: "04", t: "Recommendation", d: "Simple advice in the farmer's own language." },
  { n: "05", t: "Farmer Action", d: "Irrigate, fertilise or inspect — then track the result." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-forest/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Brand />
          <div className="flex items-center gap-2">
            <Link to="/auth" className="rounded-xl px-3 py-2 text-sm font-medium text-forest hover:bg-mint">
              Login
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="rounded-xl bg-forest px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Indian farmer inspecting a healthy green crop field" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/35" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <span className="kg-rise inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Leaf className="size-3.5" /> AI · IoT · Edge Computing
          </span>
          <h1 className="kg-rise mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
            Intelligent Farming. Better Decisions. Healthier Crops.
          </h1>
          <p className="kg-rise mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            An AI-powered smart farming system that combines soil, weather, crop and field data to provide actionable
            recommendations for farmers.
          </p>
          <div className="kg-rise mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="rounded-xl bg-fresh px-5 py-3 text-sm font-semibold text-forest shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Explore Dashboard
            </Link>
            <Link
              to="/auth"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              View Live Monitoring
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-white">
            {[
              ["8", "Live sensor streams"],
              ["BLE + Wi-Fi", "Hardware ready"],
              ["100%", "Farmer-friendly advice"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="font-display text-lg font-semibold">{v}</p>
                <p className="text-[11px] text-white/75">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">How It Works</h2>
        <p className="mt-2 max-w-2xl text-sm text-earth">
          From the field to the farmer in five transparent steps — no black boxes.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.n} className="kg-card kg-card-hover p-5">
              <span className="font-display text-sm font-bold text-fresh">{s.n}</span>
              <p className="mt-2 font-display text-base font-semibold text-forest">{s.t}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="kg-leaf-pattern border-y border-forest/10 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">Built for real farms</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="kg-card kg-card-hover p-6">
                <span className="grid size-11 place-items-center rounded-xl kg-gradient text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-forest">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl">
          <img src={fieldImg} alt="Aerial view of green agricultural fields" loading="lazy" decoding="async" className="h-72 w-full object-cover lg:h-96" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest sm:text-3xl">
            Start in Demo Mode today. Connect real hardware tomorrow.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Every screen reads from a single sensor service abstraction. Swap the demo simulator for a BLE node or an
            ESP32 REST gateway and the entire dashboard becomes live — no redesign, no rewrite.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-forest">
            {[
              "Web Bluetooth support for BLE field nodes",
              "REST polling now, WebSocket / MQTT ready",
              "Honest connection states — never a fake live badge",
              "Per-farmer accounts with private farm data",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 text-fresh" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="mt-8 inline-block rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Create your farmer account
          </Link>
        </div>
      </section>

      <footer className="border-t border-forest/10 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 sm:flex-row">
          <Brand />
          <p className="text-xs text-earth">KRISHI-GUARD AI · Smart Crop Protection & Decision Support System</p>
        </div>
      </footer>
    </div>
  );
}
