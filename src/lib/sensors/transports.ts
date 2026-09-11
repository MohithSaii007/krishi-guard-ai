import type { ConnectionState, SensorReading, SensorTransport } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function drift(value: number, delta: number, min: number, max: number, decimals = 0) {
  const next = value + (Math.random() * 2 - 1) * delta;
  const clamped = Math.min(max, Math.max(min, next));
  return Number(clamped.toFixed(decimals));
}

/**
 * DemoSensorTransport — realistic simulated field values, clearly labelled as demo.
 * Used for presentations when no hardware is attached.
 */
export class DemoSensorTransport implements SensorTransport {
  readonly mode = "demo" as const;
  readonly label = "Demo Simulator";
  private timer: ReturnType<typeof setInterval> | null = null;
  private current: SensorReading = {
    soilMoisture: 32,
    soilPH: 6.7,
    nitrogen: 48,
    phosphorus: 32,
    potassium: 41,
    temperature: 29,
    humidity: 68,
    waterLevel: 74,
    timestamp: nowIso(),
  };

  isSupported() {
    return true;
  }
  deviceName() {
    return "KRISHI-GUARD Demo Field Node";
  }
  async connect() {}
  async disconnect() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
  async refresh() {
    this.step();
  }

  private listeners = new Set<(r: SensorReading) => void>();

  private step() {
    this.current = {
      soilMoisture: drift(this.current.soilMoisture, 2.5, 14, 62),
      soilPH: drift(this.current.soilPH, 0.12, 5.2, 8.1, 1),
      nitrogen: drift(this.current.nitrogen, 2, 22, 82),
      phosphorus: drift(this.current.phosphorus, 1.5, 16, 62),
      potassium: drift(this.current.potassium, 1.5, 22, 78),
      temperature: drift(this.current.temperature, 0.8, 21, 38),
      humidity: drift(this.current.humidity, 2, 34, 86),
      waterLevel: drift(this.current.waterLevel, 1.5, 18, 98),
      timestamp: nowIso(),
    };
    this.listeners.forEach((l) => l(this.current));
  }

  subscribe(onReading: (r: SensorReading) => void, onState: (s: ConnectionState) => void) {
    this.listeners.add(onReading);
    onState("DEMO MODE");
    onReading({ ...this.current, timestamp: nowIso() });
    if (!this.timer) this.timer = setInterval(() => this.step(), 4000);
    return () => {
      this.listeners.delete(onReading);
      if (this.listeners.size === 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }
}

/**
 * WifiSensorTransport — REST polling against an ESP32 / Raspberry Pi gateway.
 * The endpoint comes from VITE_SENSOR_API_URL; nothing is hardcoded.
 * A WebSocket/MQTT transport can replace the polling loop without UI changes.
 */
const GATEWAY_STORAGE_KEY = "kg.gatewayUrl";

function normalizeEndpoint(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `http://${value}`;
}

export class WifiSensorTransport implements SensorTransport {
  readonly mode = "wifi" as const;
  readonly label = "Wi-Fi / ESP32 Gateway";
  private timer: ReturnType<typeof setInterval> | null = null;
  private endpoint = normalizeEndpoint(
    (typeof localStorage !== "undefined" ? localStorage.getItem(GATEWAY_STORAGE_KEY) : null) ??
      (import.meta.env['VITE_SENSOR_API_URL'] as string | undefined) ??
      "",
  );
  private onReading: ((r: SensorReading) => void) | null = null;
  private onState: ((s: ConnectionState, e?: string) => void) | null = null;

  isSupported() {
    return this.endpoint.length > 0;
  }
  getEndpoint() {
    return this.endpoint;
  }
  setEndpoint(raw: string) {
    this.endpoint = normalizeEndpoint(raw);
    if (typeof localStorage !== "undefined") {
      if (this.endpoint) localStorage.setItem(GATEWAY_STORAGE_KEY, this.endpoint);
      else localStorage.removeItem(GATEWAY_STORAGE_KEY);
    }
  }
  deviceName() {
    return this.endpoint ? `Gateway @ ${this.endpoint}` : null;
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error("Enter your device address first (for example 192.168.1.50/api/readings).");
    }
    if (typeof location !== "undefined" && location.protocol === "https:" && this.endpoint.startsWith("http://")) {
      throw new Error(
        "This page is secure (https) but the device address is plain http, so the browser blocks it. Serve the device over https, or open this app over http on the same network.",
      );
    }
    await this.poll();
  }

  async disconnect() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.onState?.("DISCONNECTED");
  }

  async refresh() {
    await this.poll();
  }

  private async poll() {
    if (!this.isSupported()) {
      this.onState?.("ERROR", "Enter your device address first (for example 192.168.1.50/api/readings).");
      return;
    }
    this.onState?.("SYNCING");
    try {
      const res = await fetch(this.endpoint, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Gateway responded ${res.status}`);
      const json = (await res.json()) as Partial<SensorReading>;
      const reading: SensorReading = {
        soilMoisture: Number(json.soilMoisture ?? 0),
        soilPH: Number(json.soilPH ?? 0),
        nitrogen: Number(json.nitrogen ?? 0),
        phosphorus: Number(json.phosphorus ?? 0),
        potassium: Number(json.potassium ?? 0),
        temperature: Number(json.temperature ?? 0),
        humidity: Number(json.humidity ?? 0),
        waterLevel: Number(json.waterLevel ?? 0),
        timestamp: json.timestamp ?? nowIso(),
      };
      this.onReading?.(reading);
      this.onState?.("CONNECTED");
    } catch (err) {
      const base = err instanceof Error ? err.message : "Gateway unreachable";
      this.onState?.(
        "ERROR",
        `${base}. Check that the device is switched on, on the same Wi-Fi as this phone/laptop, and that its address allows requests from the browser (CORS).`,
      );
    }
  }

  subscribe(onReading: (r: SensorReading) => void, onState: (s: ConnectionState, e?: string) => void) {
    this.onReading = onReading;
    this.onState = onState;
    if (!this.isSupported()) {
      onState("DISCONNECTED", "No device address saved yet. Enter your ESP32 / Raspberry Pi address below to connect.");
      return () => {};
    }
    void this.poll();
    this.timer = setInterval(() => void this.poll(), 5000);
    return () => {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    };
  }
}

type BluetoothLike = {
  requestDevice: (opts: unknown) => Promise<BleDevice>;
};
type BleDevice = {
  name?: string;
  gatt?: {
    connect: () => Promise<{
      getPrimaryService: (uuid: string) => Promise<{
        getCharacteristic: (uuid: string) => Promise<BleCharacteristic>;
      }>;
    }>;
    disconnect: () => void;
  };
};
type BleCharacteristic = {
  startNotifications: () => Promise<void>;
  readValue: () => Promise<DataView>;
  addEventListener: (type: string, cb: () => void) => void;
  value?: DataView;
};

/**
 * BleSensorTransport — Web Bluetooth. Expects the ESP32 to notify a JSON string
 * on a Nordic-UART style characteristic. Never reports CONNECTED unless a real
 * GATT connection exists.
 */
export class BleSensorTransport implements SensorTransport {
  readonly mode = "ble" as const;
  readonly label = "Bluetooth Low Energy";
  private device: BleDevice | null = null;
  private char: BleCharacteristic | null = null;
  private onReading: ((r: SensorReading) => void) | null = null;
  private onState: ((s: ConnectionState, e?: string) => void) | null = null;

  static SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  static CHAR_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  isSupported() {
    return typeof navigator !== "undefined" && "bluetooth" in navigator;
  }
  /** True when the app is displayed inside a frame, where browsers block Bluetooth pairing. */
  isBlockedByFrame() {
    return typeof window !== "undefined" && window.self !== window.top;
  }
  deviceName() {
    return this.device?.name ?? null;
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error(
        "This browser cannot pair Bluetooth devices. Use Chrome or Edge on Android, Windows, or macOS (Bluetooth is not available in Safari or on iPhone).",
      );
    }
    if (this.isBlockedByFrame()) {
      throw new Error(
        "Bluetooth pairing is blocked while the app is shown inside the editor preview. Open the app in its own browser tab and try again.",
      );
    }
    this.onState?.("SYNCING");
    const bt = (navigator as unknown as { bluetooth: BluetoothLike }).bluetooth;
    let device: BleDevice;
    try {
      device = await bt.requestDevice({
        filters: [{ services: [BleSensorTransport.SERVICE_UUID] }],
        optionalServices: [BleSensorTransport.SERVICE_UUID],
      });
    } catch {
      // Some ESP32 firmware does not advertise the service UUID; show every nearby device instead.
      device = await bt.requestDevice({
        acceptAllDevices: true,
        optionalServices: [BleSensorTransport.SERVICE_UUID],
      });
    }
    const server = await device.gatt?.connect();
    if (!server) throw new Error("Could not open a GATT connection to the device.");
    const service = await server.getPrimaryService(BleSensorTransport.SERVICE_UUID);
    const char = await service.getCharacteristic(BleSensorTransport.CHAR_UUID);
    await char.startNotifications();
    char.addEventListener("characteristicvaluechanged", () => this.handleValue(char.value));
    this.device = device;
    this.char = char;
    this.onState?.("CONNECTED");
    await this.refresh();
  }

  private handleValue(value?: DataView) {
    if (!value) return;
    try {
      const text = new TextDecoder().decode(value);
      const json = JSON.parse(text) as Partial<SensorReading>;
      this.onReading?.({
        soilMoisture: Number(json.soilMoisture ?? 0),
        soilPH: Number(json.soilPH ?? 0),
        nitrogen: Number(json.nitrogen ?? 0),
        phosphorus: Number(json.phosphorus ?? 0),
        potassium: Number(json.potassium ?? 0),
        temperature: Number(json.temperature ?? 0),
        humidity: Number(json.humidity ?? 0),
        waterLevel: Number(json.waterLevel ?? 0),
        timestamp: json.timestamp ?? nowIso(),
      });
    } catch {
      this.onState?.("ERROR", "Received an unreadable packet from the BLE sensor.");
    }
  }

  async refresh() {
    if (!this.char) return;
    try {
      const value = await this.char.readValue();
      this.handleValue(value);
    } catch (err) {
      this.onState?.("ERROR", err instanceof Error ? err.message : "BLE read failed");
    }
  }

  async disconnect() {
    this.device?.gatt?.disconnect();
    this.device = null;
    this.char = null;
    this.onState?.("DISCONNECTED");
  }

  subscribe(onReading: (r: SensorReading) => void, onState: (s: ConnectionState, e?: string) => void) {
    this.onReading = onReading;
    this.onState = onState;
    onState(this.device ? "CONNECTED" : "DISCONNECTED");
    return () => {
      this.onReading = null;
      this.onState = null;
    };
  }
}