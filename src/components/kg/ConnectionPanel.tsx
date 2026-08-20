import { Bluetooth, RefreshCw, Unplug, Wifi } from "lucide-react";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { ModeBadge } from "./ModeBadge";

export function ConnectionPanel() {
  const { state, mode, deviceName, error, bleSupported, gatewayConfigured, connectBle, connectWifi, disconnect, refresh, setMode } =
    useSensors();

  return (
    <section className="kg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-earth">Sensor Gateway</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-forest">
            {deviceName ?? "No device connected"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ESP32 / Raspberry Pi · Connection: {mode === "ble" ? "Bluetooth Low Energy" : mode === "wifi" ? "Wi-Fi REST" : "Simulated"}
          </p>
        </div>
        <ModeBadge />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Status", state],
          ["Transport", mode.toUpperCase()],
          ["Last sync", new Date().toLocaleTimeString()],
          ["Protocol ready", "REST · BLE · MQTT"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-mint/60 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-earth">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-forest">{value}</dd>
          </div>
        ))}
      </dl>

      {error && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">{error}</p>
      )}
      {!bleSupported && (
        <p className="mt-3 text-xs text-earth">
          Bluetooth sensor connection is supported in compatible browsers such as Chrome/Edge on supported devices.
        </p>
      )}
      {!gatewayConfigured && (
        <p className="mt-1 text-xs text-earth">
          No Wi-Fi gateway configured yet. Set the VITE_SENSOR_API_URL environment variable to point at your ESP32 /
          Raspberry Pi endpoint.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => void connectBle()}
          disabled={!bleSupported}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Bluetooth className="size-4" /> Connect BLE Device
        </button>
        <button
          onClick={() => void connectWifi()}
          className="inline-flex items-center gap-2 rounded-xl bg-agri px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Wifi className="size-4" /> Connect Wi-Fi Device
        </button>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-sm font-medium text-forest hover:bg-mint"
        >
          <RefreshCw className="size-4" /> Refresh Sensors
        </button>
        {mode === "demo" ? (
          <button
            onClick={() => setMode("wifi")}
            className="inline-flex items-center gap-2 rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-sm font-medium text-forest hover:bg-mint"
          >
            Switch to Real Sensor Mode
          </button>
        ) : (
          <button
            onClick={() => void disconnect()}
            className="inline-flex items-center gap-2 rounded-xl border border-forest/20 bg-white px-4 py-2.5 text-sm font-medium text-forest hover:bg-mint"
          >
            <Unplug className="size-4" /> Disconnect / Demo Mode
          </button>
        )}
      </div>
    </section>
  );
}