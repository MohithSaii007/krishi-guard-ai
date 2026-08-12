import { Brain, Droplets, ScanEye, Users } from "lucide-react";
import aerial from "@/assets/aerial-field.jpg";
import { SlideLayout } from "@/components/deck/SlideLayout";

const impacts = [
  { icon: Droplets, label: "SMARTER RESOURCE USE" },
  { icon: ScanEye, label: "BETTER CROP MONITORING" },
  { icon: Brain, label: "DATA-DRIVEN DECISIONS" },
  { icon: Users, label: "FARMER EMPOWERMENT" },
];

export default function Slide10() {
  return (
    <SlideLayout tone="bare">
      <img
        src={aerial}
        alt="Aerial view of healthy green Indian agricultural fields"
        loading="lazy"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--forest-deep)_88%,transparent)_0%,color-mix(in_oklab,var(--forest)_78%,transparent)_100%)]" />
      <div className="relative flex h-full flex-col justify-center px-28">
        <div className="slide-kicker text-gold">09 — The Impact</div>
        <h2 className="slide-title-lg anim mt-9 max-w-[1250px] text-white">
          From Farm Data
          <br />
          to Intelligent Decisions.
        </h2>

        <div className="mt-16 grid max-w-[1500px] grid-cols-4 gap-7">
          {impacts.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="anim rounded-3xl border border-white/18 bg-white/8 px-8 py-9"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <Icon className="size-10 text-gold" strokeWidth={1.5} />
              <div className="slide-caption mt-5 font-semibold tracking-wide text-white">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-end justify-between">
          <div>
            <div className="slide-subtitle text-white">
              KRISHI-GUARD <span className="text-gold">AI</span>
            </div>
            <div className="slide-caption mt-3 text-white/70">
              Intelligent Smart Farming &amp; Crop Protection Ecosystem
            </div>
            <div className="slide-body-lg mt-7 text-gold">
              From Farm Data to Intelligent Decisions.
            </div>
          </div>
          <div className="slide-badge text-white/60">THANK YOU</div>
        </div>
      </div>
    </SlideLayout>
  );
}