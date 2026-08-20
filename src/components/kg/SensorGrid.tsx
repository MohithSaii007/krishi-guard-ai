import { Droplets, FlaskConical, Gauge, Leaf, Sprout, Thermometer, Waves, Wind } from "lucide-react";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { SensorCard } from "./SensorCard";
import type { SensorKey } from "@/lib/sensors/types";

const CARDS: Array<{ key: SensorKey; icon: typeof Droplets }> = [
  { key: "soilMoisture", icon: Droplets },
  { key: "soilPH", icon: FlaskConical },
  { key: "nitrogen", icon: Leaf },
  { key: "phosphorus", icon: Sprout },
  { key: "potassium", icon: Gauge },
  { key: "temperature", icon: Thermometer },
  { key: "humidity", icon: Wind },
  { key: "waterLevel", icon: Waves },
];

export function SensorGrid() {
  const { reading, history } = useSensors();
  const previous = history.length > 1 ? history[history.length - 2] : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map(({ key, icon }) => (
        <SensorCard
          key={key}
          sensorKey={key}
          icon={icon}
          value={reading ? reading[key] : null}
          previous={previous ? previous[key] : null}
          updatedAt={reading?.timestamp ?? null}
        />
      ))}
    </div>
  );
}