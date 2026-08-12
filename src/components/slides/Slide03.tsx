import { CloudSun, Droplet, Camera, Smartphone, FlaskConical } from "lucide-react";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const inputs = [
  { icon: FlaskConical, label: "SOIL", text: "pH • NPK • Moisture" },
  { icon: CloudSun, label: "WEATHER", text: "Temp • Humidity • Rainfall" },
  { icon: Droplet, label: "WATER", text: "Water / moisture monitoring" },
  { icon: Camera, label: "CROP IMAGING", text: "Drone / crop images" },
  { icon: Smartphone, label: "FARMER APP", text: "Mobile + Voice AI" },
];

export default function Slide03() {
  return (
    <SlideLayout>
      <div className="flex h-full flex-col px-24 pb-28 pt-16">
        <Kicker label="02 — Our Solution" />
        <div className="mt-7 flex items-end justify-between gap-16">
          <h2 className="slide-title max-w-[900px] text-forest">
            One intelligent ecosystem for the farm.
          </h2>
          <p className="slide-body mb-3 max-w-[720px] text-charcoal/70">
            KRISHI-GUARD AI is an AI and IoT-based smart farming ecosystem that collects
            agricultural information and converts it into actionable recommendations.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center">
          <div className="grid w-full grid-cols-5 gap-7">
            {inputs.map(({ icon: Icon, label, text }, i) => (
              <div
                key={label}
                className="anim flex flex-col items-center rounded-3xl border border-forest/10 bg-white/80 px-6 py-8 text-center shadow-[0_10px_30px_-24px_var(--forest)]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-leaf/12">
                  <Icon className="size-8 text-leaf" strokeWidth={1.6} />
                </span>
                <div className="slide-badge mt-5 font-semibold text-forest">{label}</div>
                <div className="slide-caption mt-2 text-charcoal/60">{text}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 h-12 w-px bg-forest/25" />
          <div className="flex w-[760px] flex-col items-center rounded-[40px] bg-forest px-14 py-9 text-center shadow-[0_30px_60px_-30px_var(--forest)]">
            <div className="slide-kicker text-gold">Central Intelligence</div>
            <div className="slide-subtitle mt-3 text-white">KRISHI-GUARD AI</div>
            <div className="slide-caption mt-2 text-white/70">
              Edge AI Gateway + Decision Engine
            </div>
          </div>
          <div className="mt-10 flex items-center gap-6">
            {["COLLECT", "ANALYZE", "RECOMMEND", "ACT"].map((s, i) => (
              <div key={s} className="flex items-center gap-6">
                <span className="slide-badge rounded-full border border-forest/15 bg-white/80 px-7 py-3 font-semibold text-forest">
                  {s}
                </span>
                {i < 3 && <span className="slide-badge text-leaf">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer index={3} />
    </SlideLayout>
  );
}