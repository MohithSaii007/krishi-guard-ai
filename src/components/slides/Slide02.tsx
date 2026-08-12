import { CloudRain, Droplets, Sprout, TriangleAlert } from "lucide-react";
import farmerInspect from "@/assets/farmer-inspect.jpg";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const items = [
  { icon: Droplets, label: "WATER", text: "Uncertain irrigation requirements" },
  { icon: Sprout, label: "SOIL", text: "Limited real-time soil intelligence" },
  { icon: TriangleAlert, label: "CROP HEALTH", text: "Disease and pest risks identified late" },
  { icon: CloudRain, label: "WEATHER", text: "Changing weather affects farm decisions" },
];

export default function Slide02() {
  return (
    <SlideLayout>
      <div className="grid h-full grid-cols-[42%_58%]">
        <div className="relative h-full">
          <img
            src={farmerInspect}
            alt="Indian farmer inspecting a diseased crop leaf in his field"
            loading="lazy"
            width={1200}
            height={1504}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_60%,var(--cream)_100%)]" />
        </div>
        <div className="flex flex-col justify-center px-20 py-24">
          <Kicker label="01 — The Challenge" />
          <h2 className="slide-title mt-7 max-w-[900px] text-forest">
            Farming decisions are still highly uncertain.
          </h2>
          <p className="slide-body mt-6 max-w-[840px] text-charcoal/70">
            Farmers often decide without integrated, real-time information about soil, weather,
            water and crop health.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {items.map(({ icon: Icon, label, text }, i) => (
              <div
                key={label}
                className="anim rounded-3xl border border-forest/10 bg-white/70 px-8 py-7 shadow-[0_10px_30px_-22px_var(--forest)]"
                style={{ animationDelay: `${i * 0.09}s` }}
              >
                <Icon className="size-8 text-leaf" strokeWidth={1.6} />
                <div className="slide-badge mt-4 font-semibold text-forest">{label}</div>
                <div className="slide-caption mt-2 text-charcoal/65">{text}</div>
              </div>
            ))}
          </div>
          <div className="mt-9 rounded-2xl border-l-4 border-gold bg-forest px-8 py-6">
            <p className="slide-body text-white">
              Farmers need timely, field-specific intelligence — not just raw data.
            </p>
          </div>
        </div>
      </div>
      <Footer index={2} />
    </SlideLayout>
  );
}