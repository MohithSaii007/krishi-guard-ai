import { Building2, Landmark, Users, Wheat } from "lucide-react";
import { Footer, Kicker, SlideLayout } from "@/components/deck/SlideLayout";

const users = [
  { icon: Users, label: "FARMERS" },
  { icon: Wheat, label: "FARMER PRODUCER ORGANIZATIONS" },
  { icon: Building2, label: "AGRI-MSMEs" },
  { icon: Landmark, label: "AGRICULTURAL ORGANIZATIONS" },
];

const phases = [
  ["PHASE 1", "IoT + Farm Monitoring"],
  ["PHASE 2", "AI Recommendations"],
  ["PHASE 3", "Advanced Crop Intelligence"],
];

const resources = [
  "Soil sensors",
  "Weather sensors",
  "Edge device",
  "Camera",
  "Connectivity",
  "Web / mobile application",
];

export default function Slide09() {
  return (
    <SlideLayout>
      <div className="flex h-full flex-col justify-center px-24 pb-16">
        <Kicker label="08 — From Prototype to Impact" />
        <h2 className="slide-title mt-7 text-forest">Users, development path &amp; resources.</h2>

        <div className="mt-14 grid grid-cols-3 gap-9">
          <div className="anim rounded-3xl border border-forest/10 bg-white/70 p-11">
            <div className="slide-subtitle text-forest">Who is it for?</div>
            <div className="mt-9 space-y-6">
              {users.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-5">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-leaf/12">
                    <Icon className="size-7 text-leaf" strokeWidth={1.6} />
                  </span>
                  <span className="slide-caption font-medium text-charcoal/80">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="anim rounded-3xl bg-forest p-11"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="slide-subtitle text-white">Prototype → Pilot → Scale</div>
            <div className="mt-9 space-y-6">
              {phases.map(([p, t]) => (
                <div key={p} className="rounded-2xl border border-white/15 bg-white/6 px-7 py-5">
                  <div className="slide-badge font-semibold text-gold">{p}</div>
                  <div className="slide-caption mt-2 text-white/80">{t}</div>
                </div>
              ))}
            </div>
            <div className="mt-9 rounded-2xl border-l-4 border-gold bg-white/8 px-7 py-5">
              <div className="slide-badge text-white/60">TARGET PROTOTYPE</div>
              <div className="slide-body mt-2 font-semibold text-white">TRL 4 – 5</div>
              <div className="slide-chrome mt-2 text-white/45">
                To be confirmed against actual prototype validation
              </div>
            </div>
          </div>

          <div
            className="anim rounded-3xl border border-forest/10 bg-white/70 p-11"
            style={{ animationDelay: "0.24s" }}
          >
            <div className="slide-subtitle text-forest">Prototype Requirements</div>
            <div className="mt-9 space-y-5">
              {resources.map((r) => (
                <div key={r} className="flex items-center gap-4">
                  <span className="size-2 rounded-full bg-leaf" />
                  <span className="slide-caption text-charcoal/75">{r}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-dashed border-earth/50 bg-earth/8 px-8 py-7">
              <div className="slide-badge text-earth">PROTOTYPE COST</div>
              <div className="slide-subtitle mt-2 text-forest">₹ ________</div>
              <div className="slide-chrome mt-2 text-charcoal/45">
                To be finalised after component costing
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer index={9} />
    </SlideLayout>
  );
}