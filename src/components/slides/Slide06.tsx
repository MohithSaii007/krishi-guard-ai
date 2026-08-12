import { Bug, Droplets, LineChart, Leaf, Layers, ShieldAlert } from "lucide-react";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const modules = [
  { icon: Layers, title: "SOIL INTELLIGENCE", text: "Analyzes soil parameters for better farm management." },
  { icon: ShieldAlert, title: "DISEASE PREDICTION", text: "Identifies potential crop disease risks." },
  { icon: Bug, title: "PEST PREDICTION", text: "Early warnings regarding possible pest problems." },
  { icon: Droplets, title: "IRRIGATION OPTIMIZATION", text: "Soil, water and weather based irrigation guidance." },
  { icon: Leaf, title: "FERTILIZER OPTIMIZATION", text: "Supports fertilizer planning from soil and crop data." },
  { icon: LineChart, title: "MARKET INTELLIGENCE", text: "Provides market-related agricultural information." },
];

export default function Slide06() {
  return (
    <SlideLayout tone="dark">
      <div className="absolute -left-40 top-1/2 size-[720px] -translate-y-1/2 rounded-full bg-leaf/10 blur-[120px]" />
      <div className="relative flex h-full flex-col px-24 pt-20">
        <Kicker label="05 — AI Intelligence" tone="dark" />
        <h2 className="slide-title mt-7 text-white">The brain behind the farm.</h2>

        <div className="mt-14 grid flex-1 grid-cols-[1fr_520px_1fr] items-center gap-10">
          <div className="space-y-6">
            {modules.slice(0, 3).map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="anim flex items-start gap-5 rounded-2xl border border-white/15 bg-white/6 px-8 py-6"
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
              >
                <Icon className="mt-1 size-8 shrink-0 text-leaf" strokeWidth={1.6} />
                <div>
                  <div className="slide-body font-semibold text-white">{title}</div>
                  <div className="slide-caption mt-2 text-white/60">{text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="anim flex flex-col items-center">
            <div className="relative flex size-[420px] items-center justify-center rounded-full border border-leaf/40 bg-forest-deep/70 shadow-[0_0_120px_-30px_var(--leaf)]">
              <div className="absolute inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-gold/25" />
              <div className="text-center">
                <div className="slide-title-lg text-gold">AI</div>
                <div className="slide-body mt-2 text-white">DECISION ENGINE</div>
                <div className="slide-caption mt-2 text-white/55">Neural inference at the edge</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {modules.slice(3).map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="anim flex items-start gap-5 rounded-2xl border border-white/15 bg-white/6 px-8 py-6"
                style={{ animationDelay: `${0.5 + i * 0.12}s` }}
              >
                <Icon className="mt-1 size-8 shrink-0 text-leaf" strokeWidth={1.6} />
                <div>
                  <div className="slide-body font-semibold text-white">{title}</div>
                  <div className="slide-caption mt-2 text-white/60">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slide-body-lg mb-24 text-center text-white/75">
          Multiple agricultural signals <span className="text-gold">→</span> one intelligent
          decision layer
        </div>
      </div>
      <Footer index={6} tone="dark" />
    </SlideLayout>
  );
}