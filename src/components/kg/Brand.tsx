import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl kg-gradient text-white shadow-sm">
        <Leaf className="size-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-semibold text-forest">KRISHI-GUARD AI</span>
          <span className="block text-[11px] text-earth">Smart Crop Protection</span>
        </span>
      )}
    </div>
  );
}