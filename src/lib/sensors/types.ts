/**
 * Canonical sensor payload shared by every transport (BLE, Wi-Fi/ESP32 API, demo).
 * ESP32 / Raspberry Pi should publish exactly this JSON shape.
 */
export interface SensorReading {
  soilMoisture: number;
  soilPH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  waterLevel: number;
  timestamp: string;
}

export type ConnectionState = "CONNECTED" | "DISCONNECTED" | "DEMO MODE" | "SYNCING" | "ERROR";

export type SensorMode = "demo" | "ble" | "wifi";

export interface SensorSnapshot {
  reading: SensorReading | null;
  state: ConnectionState;
  mode: SensorMode;
  deviceName: string | null;
  error: string | null;
  updatedAt: string | null;
}

/** Every transport implements this. The UI never talks to a transport directly. */
export interface SensorTransport {
  readonly mode: SensorMode;
  readonly label: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  /** Subscribe to readings. Returns an unsubscribe function. */
  subscribe(onReading: (reading: SensorReading) => void, onState: (state: ConnectionState, error?: string) => void): () => void;
  refresh(): Promise<void>;
  isSupported(): boolean;
  deviceName(): string | null;
}

export const SENSOR_META = {
  soilMoisture: { label: "Soil Moisture", unit: "%", optimal: [25, 60] as [number, number], warn: [20, 70] as [number, number] },
  soilPH: { label: "Soil pH", unit: "", optimal: [6, 7.5] as [number, number], warn: [5.5, 8] as [number, number] },
  nitrogen: { label: "Nitrogen (N)", unit: "mg/kg", optimal: [40, 80] as [number, number], warn: [25, 100] as [number, number] },
  phosphorus: { label: "Phosphorus (P)", unit: "mg/kg", optimal: [25, 60] as [number, number], warn: [15, 80] as [number, number] },
  potassium: { label: "Potassium (K)", unit: "mg/kg", optimal: [35, 80] as [number, number], warn: [20, 100] as [number, number] },
  temperature: { label: "Temperature", unit: "°C", optimal: [18, 32] as [number, number], warn: [12, 36] as [number, number] },
  humidity: { label: "Humidity", unit: "%", optimal: [50, 80] as [number, number], warn: [35, 90] as [number, number] },
  waterLevel: { label: "Water Level", unit: "%", optimal: [40, 100] as [number, number], warn: [20, 100] as [number, number] },
} as const;

export type SensorKey = keyof typeof SENSOR_META;

export type Status = "optimal" | "warning" | "critical";

export function statusOf(key: SensorKey, value: number | null | undefined): Status {
  if (value == null || Number.isNaN(value)) return "critical";
  const meta = SENSOR_META[key];
  if (value >= meta.optimal[0] && value <= meta.optimal[1]) return "optimal";
  if (value >= meta.warn[0] && value <= meta.warn[1]) return "warning";
  return "critical";
}