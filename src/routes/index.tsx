import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
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
  const [full, setFull] = useState(false);

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
      } else if (e.key.toLowerCase() === "f") {
        void document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
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

      <div className="flex items-center justify-center gap-3 border-t border-white/10 bg-charcoal px-6 py-4 text-white/70">
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
        <button
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen?.();
            else void document.documentElement.requestFullscreen?.();
          }}
          aria-label={full ? "Exit fullscreen" : "Zoom to fullscreen"}
          className="ml-2 rounded-full border border-white/15 p-2 transition-colors hover:bg-white/10"
        >
          {full ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </button>
      </div>

    </main>
  );
}
