import heroFarmer from "@/assets/hero-farmer.jpg";
import { SlideLayout } from "@/components/deck/SlideLayout";

export default function Slide01() {
  return (
    <SlideLayout tone="bare">
      <img
        src={heroFarmer}
        alt="Indian farmer using a smartphone in a green paddy field at sunrise"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--forest-deep)_8%,color-mix(in_oklab,var(--forest)_82%,transparent)_45%,color-mix(in_oklab,var(--forest)_25%,transparent)_100%)]" />
      <div className="absolute inset-0 flex flex-col justify-center px-28">
        <div className="anim max-w-[1150px]">
          <div className="slide-kicker text-gold">AI • IoT • Edge Computing • Smart Agriculture</div>
          <h1 className="slide-title-lg mt-10 text-white">
            KRISHI-GUARD <span className="text-gold">AI</span>
          </h1>
          <p className="slide-subtitle mt-8 max-w-[980px] text-white/90">
            Intelligent Smart Farming &amp; Crop Protection Ecosystem
          </p>
          <div className="mt-12 h-px w-[520px] bg-white/25" />
        </div>
      </div>
      <div className="absolute bottom-16 left-28 right-28 flex items-end justify-between text-white/75">
        <div>
          <div className="slide-badge text-gold">MSME IDEA HACKATHON 6.0</div>
          <div className="slide-caption mt-3">
            Team Name &nbsp;|&nbsp; CSE – Data Science &nbsp;|&nbsp; Sri Venkateswara College of
            Engineering, Tirupati
          </div>
        </div>
        <div className="slide-page">01 / 10</div>
      </div>
    </SlideLayout>
  );
}