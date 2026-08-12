import { Mic, Sparkles, Radio, Hand } from "lucide-react";
import farmerPhone from "@/assets/farmer-phone.jpg";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const points = [
  { icon: Radio, label: "REAL-TIME INSIGHTS" },
  { icon: Sparkles, label: "ACTIONABLE RECOMMENDATIONS" },
  { icon: Hand, label: "FARMER-FRIENDLY INTERFACE" },
  { icon: Mic, label: "VOICE-ENABLED INTERACTION" },
];

function PhoneMock() {
  return (
    <div className="anim relative w-[320px] rounded-[46px] border-[10px] border-charcoal bg-forest-deep px-6 pb-5 pt-4 shadow-[0_50px_90px_-40px_var(--forest)]">
      <div className="mx-auto h-1.5 w-20 rounded-full bg-white/25" />
      <div className="mt-4">
        <div className="slide-badge text-gold">KRISHI-GUARD</div>
        <div className="slide-subtitle mt-2 whitespace-nowrap font-semibold text-white" style={{fontSize:"38px"}}>Good Morning</div>
        <div className="slide-chrome mt-1 text-white/55">FIELD 01 • TIRUPATI</div>

        <div className="mt-3 rounded-3xl bg-white/10 p-4">
          <div className="slide-chrome text-white/60">SOIL MOISTURE</div>
          <div className="mt-1 flex items-end gap-3">
            <span className="slide-body-lg font-semibold text-white">27%</span>
            <span className="slide-chrome mb-2 rounded-full bg-gold/20 px-3 py-1.5 font-semibold text-gold">
              LOW
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[27%] rounded-full bg-gold" />
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {[
            ["IRRIGATION", "Recommended", "text-leaf"],
            ["RAIN FORECAST", "Low", "text-white"],
            ["CROP HEALTH", "Normal", "text-leaf"],
          ].map(([k, v, c]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 px-5 py-2.5"
            >
              <span className="slide-chrome text-white/60">{k}</span>
              <span className={`slide-chrome font-semibold ${c}`}>{v}</span>
            </div>
          ))}
        </div>

        <div className="slide-badge mt-3 rounded-2xl bg-leaf py-3 text-center font-semibold text-white">
          VIEW INSIGHTS
        </div>
      </div>
    </div>
  );
}

export default function Slide07() {
  return (
    <SlideLayout>
      <div className="grid h-full grid-cols-[58%_42%]">
        <div className="flex flex-col justify-center px-24 pb-28 pt-16">
          <Kicker label="06 — Farmer Experience" />
          <h2 className="slide-title mt-7 text-forest">
            Complex data.
            <br />
            Simple decisions.
          </h2>
          <div className="mt-8 flex items-start gap-12">
            <PhoneMock />
            <div className="space-y-6">
              {points.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="anim flex items-center gap-5"
                  style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-leaf/12">
                    <Icon className="size-7 text-leaf" strokeWidth={1.6} />
                  </span>
                  <span className="slide-body font-medium text-forest">{label}</span>
                </div>
              ))}
              <div className="slide-caption max-w-[380px] rounded-2xl border-l-4 border-gold bg-white/70 px-7 py-6 text-charcoal/70">
                From raw farm data <span className="text-leaf">→</span> simple farmer decisions
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-full">
          <img
            src={farmerPhone}
            alt="Indian farmer in a crop field reading recommendations on his smartphone"
            loading="lazy"
            width={1200}
            height={1504}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_left,transparent_60%,var(--cream)_100%)]" />
        </div>
      </div>
      <Footer index={7} />
    </SlideLayout>
  );
}