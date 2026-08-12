import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2x2, Maximize, Printer } from "lucide-react";
import { ScaledSlide } from "@/components/deck/ScaledSlide";
import { slides } from "@/components/deck/slides";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRISHI-GUARD AI — AgriTech Pitch Deck" },
      {
        name: "description",
        content:
          "KRISHI-GUARD AI: an AI, IoT and Edge Computing smart farming and crop protection ecosystem. 10-slide pitch deck for MSME Idea Hackathon 6.0.",
      },
      { property: "og:title", content: "KRISHI-GUARD AI — AgriTech Pitch Deck" },
      {
        property: "og:description",
        content: "Intelligent Smart Farming & Crop Protection Ecosystem — AI • IoT • Edge AI.",
      },
    ],
  }),
  component: Deck,
});

function Deck() {
  const [index, setIndex] = useState(0);
  const [grid, setGrid] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((i) => Math.min(slides.length - 1, Math.max(0, typeof next === "number" ? next : i)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key.toLowerCase() === "g") {
        setGrid((g) => !g);
      } else if (e.key === "Escape") {
        setGrid(false);
      } else if (e.key.toLowerCase() === "f") {
        void document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.title = `${index + 1}/${slides.length} — ${slides[index]?.title ?? ""} | KRISHI-GUARD AI`;
  }, [index]);

  const current = slides[index] ?? slides[0]!;
  const Current = current.Component;

  return (
    <main className="flex h-screen flex-col bg-charcoal">
      <div className="relative flex-1">
        <ScaledSlide>
          <Current />
        </ScaledSlide>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-white/10 bg-charcoal px-6 py-4 text-white/70">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.18em] text-[color:var(--gold)]">
            KRISHI-GUARD AI
          </span>
          <span className="text-xs text-white/40">{current.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="w-16 text-center text-sm tabular-nums">
            {index + 1} / {slides.length}
          </span>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGrid(true)}
            aria-label="Grid overview"
            className="rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
          >
            <Grid2x2 className="size-4" />
          </button>
          <button
            onClick={() => void document.documentElement.requestFullscreen?.()}
            aria-label="Present fullscreen"
            className="rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
          >
            <Maximize className="size-4" />
          </button>
          <Link
            to="/print"
            aria-label="Print / export PDF"
            className="rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
          >
            <Printer className="size-4" />
          </Link>
        </div>
      </div>

      {grid && (
        <div className="fixed inset-0 z-50 overflow-auto bg-charcoal/95 p-10">
          <div className="grid grid-cols-3 gap-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setIndex(i);
                  setGrid(false);
                }}
                className="group text-left"
              >
                <div className="aspect-video overflow-hidden rounded-xl border border-white/15 transition-colors group-hover:border-[color:var(--gold)]">
                  <ScaledSlide>
                    <s.Component />
                  </ScaledSlide>
                </div>
                <div className="mt-2 text-xs text-white/60">
                  {String(i + 1).padStart(2, "0")} — {s.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
