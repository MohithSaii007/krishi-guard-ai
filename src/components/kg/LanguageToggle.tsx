import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white p-1 pl-2 shadow-sm ring-1 ring-forest/10",
        className,
      )}
      role="group"
    >
      <Languages className="size-3.5 text-earth" aria-hidden />
      {(
        [
          { code: "en" as const, label: "EN" },
          { code: "te" as const, label: "తెలుగు" },
        ]
      ).map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
            lang === code ? "bg-forest text-white" : "text-forest/60 hover:bg-mint",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
