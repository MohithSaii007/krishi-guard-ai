import { Cpu, Gauge, Lightbulb, Router, Smartphone } from "lucide-react";
import aerial from "@/assets/aerial-field.jpg";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const steps = [
  { n: "01", icon: Gauge, title: "COLLECT", text: "Soil, weather, water & crop data" },
  { n: "02", icon: Router, title: "CONNECT", text: "IoT gateway gathers field information" },
  { n: "03", icon: Cpu, title: "ANALYZE", text: "Edge AI processes agricultural data" },
  { n: "04", icon: Lightbulb, title: "DECIDE", text: "AI identifies risks and requirements" },
  { n: "05", icon: Smartphone, title: "ACT", text: "Farmer receives recommendations" },
];

export default function Slide05() {
  return (
    <SlideLayout>
      <img
        src={aerial}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
      />
      <div className="absolute inset-0 bg-cream/55" />
      <div className="relative flex h-full flex-col justify-center px-24 pb-16">
        <Kicker label="04 — How It Works" />
        <h2 className="slide-title mt-8 text-forest">The intelligence loop</h2>
        <p className="slide-body mt-6 max-w-[900px] text-charcoal/70">
          A continuous field-to-farmer cycle that turns sensing into decision support.
        </p>

        <div className="mt-16 flex items-stretch">
          {steps.map(({ n, icon: Icon, title, text }, i) => (
            <div key={n} className="flex flex-1 items-start">
              <div
                className="anim flex-1 rounded-3xl border border-forest/10 bg-white/80 px-8 py-9 shadow-[0_16px_40px_-28px_var(--forest)]"
                style={{ animationDelay: `${i * 0.14}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="slide-badge font-semibold text-gold">STEP {n}</span>
                  <Icon className="size-8 text-leaf" strokeWidth={1.6} />
                </div>
                <div className="slide-subtitle mt-6 text-forest">{title}</div>
                <div className="slide-caption mt-4 text-charcoal/65">{text}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-24 px-3 slide-body text-leaf">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-6">
          <span className="h-px flex-1 bg-forest/15" />
          <span className="slide-badge rounded-full bg-forest px-8 py-4 text-white">
            SENSE → PROCESS → RECOMMEND → LEARN
          </span>
          <span className="h-px flex-1 bg-forest/15" />
        </div>
      </div>
      <Footer index={5} />
    </SlideLayout>
  );
}