import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/kg/AppShell";
import { ConnectionPanel } from "@/components/kg/ConnectionPanel";
import { SensorGrid } from "@/components/kg/SensorGrid";

export const Route = createFileRoute("/_authenticated/sensors")({
  component: Sensors,
});

const PAYLOAD = `{
  "soilMoisture": 32.4,
  "soilPH": 6.7,
  "nitrogen": 54,
  "phosphorus": 38,
  "potassium": 47,
  "temperature": 29.8,
  "humidity": 62,
  "waterLevel": 71,
  "timestamp": "2025-01-01T10:00:00.000Z"
}`;

function Sensors() {
  return (
    <AppShell title="Sensor Devices" subtitle="Connect ESP32 / Raspberry Pi nodes over Bluetooth or Wi-Fi">
      <ConnectionPanel />

      <h2 className="mt-8 font-display text-lg font-semibold text-forest">Sensor channels</h2>
      <div className="mt-4">
        <SensorGrid />
      </div>

      <section className="kg-card mt-8 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-forest">Hardware integration guide</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your device only has to publish this JSON shape. Point <code className="rounded bg-mint px-1">VITE_SENSOR_API_URL</code>{" "}
          at the endpoint (Wi-Fi) or stream the same JSON over a BLE notify characteristic.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-charcoal p-4 text-xs leading-relaxed text-mint">{PAYLOAD}</pre>
        <ul className="mt-4 space-y-2 text-sm text-forest">
          <li>· Wi-Fi: HTTP GET returning the object above (polled every few seconds).</li>
          <li>· BLE: Nordic UART style notify characteristic sending the same JSON per line.</li>
          <li>· MQTT / WebSocket: add a transport in <code className="rounded bg-mint px-1">src/lib/sensors/transports.ts</code>; no UI changes needed.</li>
        </ul>
      </section>
    </AppShell>
  );
}