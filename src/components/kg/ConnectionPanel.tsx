import { useEffect, useState } from "react";
import { Bluetooth, RefreshCw, Unplug, Wifi } from "lucide-react";
import { useSensors } from "@/lib/sensors/SensorProvider";
import { ModeBadge } from "./ModeBadge";

export function ConnectionPanel() {
  const {
    state,
    mode,
    deviceName,
    error,
    bleSupported,
    bleBlockedByFrame,
    gatewayConfigured,
    gatewayUrl,
    setGatewayUrl,
    connectBle,
    connectWifi,
    disconnect,
    refresh,
    setMode,
  } = useSensors();

  const [draftUrl, setDraftUrl] = useState("");
  useEffect(() => setDraftUrl(gatewayUrl), [gatewayUrl]);


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
      <div className="mt-5 rounded-xl border border-forest/15 bg-mint/40 p-4">
        <label htmlFor="gateway-url" className="text-xs font-semibold uppercase tracking-wide text-earth">
          Wi-Fi device address
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="gateway-url"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="192.168.1.50/api/readings"
            className="flex-1 rounded-xl border border-forest/20 bg-white px-3 py-2.5 text-sm text-forest outline-none focus:border-forest"
          />
          <button
            onClick={() => {
              setGatewayUrl(draftUrl);
              if (draftUrl.trim()) void connectWifi();
            }}
            className="rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Save & Connect
          </button>
        </div>
        <p className="mt-2 text-xs text-earth">
          Type the address your ESP32 or Raspberry Pi shows on your Wi-Fi, then press Save & Connect. Your phone or
          laptop must be on the same Wi-Fi network as the device.
        </p>
      </div>

      {!bleSupported && (
        <p className="mt-3 text-xs text-earth">
          Bluetooth pairing needs Chrome or Edge on Android, Windows or macOS. It does not work on iPhone or in Safari.
        </p>
      )}
      {bleSupported && bleBlockedByFrame && (
        <p className="mt-3 text-xs text-earth">
          Bluetooth pairing is blocked inside this preview window. Open the app in its own browser tab, then tap Connect
          BLE Device.
        </p>
      )}
      {!gatewayConfigured && (
        <p className="mt-1 text-xs text-earth">No Wi-Fi device saved yet — add its address above to connect.</p>
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