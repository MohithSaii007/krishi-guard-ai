import { Activity, Radio, TriangleAlert, WifiOff, RefreshCw } from "lucide-react";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { cn } from "@/lib/utils";

export function ModeBadge({ className }: { className?: string }) {
  const { state } = useSensors();

  const map = {
    "DEMO MODE": { text: "DEMO MODE", cls: "bg-amber-warn/15 text-earth border-amber-warn/40", Icon: Activity },
    CONNECTED: { text: "LIVE SENSOR DATA", cls: "bg-fresh/15 text-agri border-fresh/40", Icon: Radio },
    SYNCING: { text: "SYNCING", cls: "bg-mint text-agri border-fresh/30", Icon: RefreshCw },
    DISCONNECTED: { text: "DISCONNECTED", cls: "bg-muted text-muted-foreground border-border", Icon: WifiOff },
    ERROR: { text: "SENSOR ERROR", cls: "bg-danger/15 text-danger border-danger/40", Icon: TriangleAlert },
  } as const;

  const { text, cls, Icon } = map[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        cls,
        className,
      )}
    >
      <Icon className={cn("size-3", state === "SYNCING" && "animate-spin")} />
      {text}
    </span>
  );
}