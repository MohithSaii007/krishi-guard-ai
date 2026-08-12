import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

function Node({
  title,
  sub,
  accent = false,
  delay = 0,
  className = "",
}: {
  title: string;
  sub?: string;
  accent?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`anim rounded-2xl border px-9 py-5 text-center ${
        accent
          ? "border-gold/50 bg-gold/12 shadow-[0_0_40px_-14px_var(--gold)]"
          : "border-white/18 bg-white/8"
      } ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`slide-body font-semibold ${accent ? "text-gold" : "text-white"}`}>
        {title}
      </div>
      {sub && <div className="slide-caption mt-1 text-white/55">{sub}</div>}
    </div>
  );
}

function Connector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="anim flex flex-col items-center" style={{ animationDelay: `${delay}s` }}>
      <div className="h-9 w-px bg-leaf/60" />
      <div className="-mt-1 size-2 rotate-45 border-b border-r border-leaf" />
    </div>
  );
}

export default function Slide04() {
  return (
    <SlideLayout tone="dark">
      <div className="flex h-full gap-16 px-24 pt-20">
        <div className="w-[420px] shrink-0">
          <Kicker label="03 — System Architecture" tone="dark" />
          <h2 className="slide-title mt-8 text-white">From farm data to intelligent decisions.</h2>
          <div className="mt-12 space-y-5">
            {["Water monitoring", "Market data", "Weather data"].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="h-px w-8 bg-leaf" />
                <span className="slide-caption text-white/70">{s}</span>
              </div>
            ))}
          </div>
          <div className="slide-badge mt-16 rounded-full border border-white/20 px-7 py-4 text-center text-white/80">
            Supporting data sources
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <Node title="FARM" delay={0} className="w-[280px]" />
          <Connector delay={0.05} />
          <div className="flex items-start gap-8">
            <Node title="SOIL IoT" sub="pH • NPK • Moisture" delay={0.12} />
            <Node title="WEATHER STATION" sub="Micro-climate" delay={0.18} />
            <Node title="CROP IMAGING" sub="Drone / camera" delay={0.24} />
          </div>
          <Connector delay={0.3} />
          <Node
            title="EDGE AI GATEWAY"
            sub="Raspberry Pi / Jetson"
            accent
            delay={0.36}
            className="w-[520px]"
          />
          <Connector delay={0.42} />
          <Node title="AI DECISION ENGINE" delay={0.48} className="w-[520px]" />
          <Connector delay={0.54} />
          <Node title="RECOMMENDATION ENGINE" delay={0.6} className="w-[520px]" />
          <Connector delay={0.66} />
          <Node title="FARMER APP" sub="Mobile • Voice AI" accent delay={0.72} className="w-[380px]" />
          <div className="slide-body mt-12 text-white/70">
            IoT <span className="text-leaf">→</span> Edge AI <span className="text-leaf">→</span>{" "}
            Decision Intelligence <span className="text-leaf">→</span> Farmer
          </div>
        </div>
      </div>
      <Footer index={4} tone="dark" />
    </SlideLayout>
  );
}