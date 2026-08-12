import { Cpu, Camera, Radio, Droplets, UserRound } from "lucide-react";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const cards = [
  { n: "01", icon: Radio, title: "IoT", text: "Real-time farm sensing" },
  { n: "02", icon: Cpu, title: "EDGE AI", text: "Local intelligent processing" },
  { n: "03", icon: Camera, title: "CROP IMAGING", text: "Visual crop monitoring" },
  { n: "04", icon: Droplets, title: "RESOURCE INTELLIGENCE", text: "Irrigation & fertilizer guidance" },
  { n: "05", icon: UserRound, title: "FARMER INTELLIGENCE", text: "Simple actionable guidance" },
];

export default function Slide08() {
  return (
    <SlideLayout>
      <div className="flex h-full flex-col justify-center px-24 pb-16">
        <Kicker label="07 — What Makes It Different?" />
        <h2 className="slide-title mt-7 max-w-[1250px] text-forest">
          More than smart farming. Integrated farm intelligence.
        </h2>

        <div className="mt-14 grid grid-cols-5 gap-7">
          {cards.map(({ n, icon: Icon, title, text }, i) => (
            <div
              key={n}
              className="anim flex min-h-[300px] flex-col rounded-3xl bg-forest px-8 py-9 shadow-[0_24px_50px_-30px_var(--forest)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="slide-badge font-semibold text-gold">{n}</span>
                <Icon className="size-8 text-leaf" strokeWidth={1.6} />
              </div>
              <div className="mt-auto">
                <div className="slide-body font-semibold text-white">{title}</div>
                <div className="slide-caption mt-3 text-white/60">{text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-10 rounded-3xl border border-forest/10 bg-white/70 px-12 py-9">
          <span className="slide-title text-gold">+</span>
          <p className="slide-body max-w-[1300px] text-charcoal/75">
            Instead of disconnected agricultural tools, KRISHI-GUARD AI brings multiple intelligence
            layers into one ecosystem.
          </p>
        </div>
      </div>
      <Footer index={8} />
    </SlideLayout>
  );
}