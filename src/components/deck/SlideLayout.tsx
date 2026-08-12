import type { ReactNode } from "react";

export function SlideLayout({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "bare";
  className?: string;
}) {
  const toneClass =
    tone === "dark"
      ? "bg-forest text-white"
      : tone === "light"
        ? "bg-cream text-charcoal"
        : "bg-forest-deep text-white";
  return <div className={`slide-content ${toneClass} ${className}`}>{children}</div>;
}

export function Kicker({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-3 w-3 rounded-full bg-gold" />
      <span className={`slide-kicker ${tone === "dark" ? "text-gold" : "text-leaf"}`}>
        {label}
      </span>
    </div>
  );
}

export function Footer({
  index,
  tone = "light",
}: {
  index: number;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`absolute bottom-12 left-24 right-24 flex items-center justify-between ${
        tone === "dark" ? "text-white/50" : "text-forest/50"
      }`}
    >
      <span className="slide-footer">KRISHI-GUARD AI</span>
      <span className="slide-page">{String(index).padStart(2, "0")} / 10</span>
    </div>
  );
}