import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BleSensorTransport, DemoSensorTransport, WifiSensorTransport } from "./transports";
import type { ConnectionState, SensorMode, SensorReading, SensorTransport } from "./types";

interface SensorContextValue {
  reading: SensorReading | null;
  history: SensorReading[];
  state: ConnectionState;
  mode: SensorMode;
  isDemo: boolean;
  deviceName: string | null;
  error: string | null;
  bleSupported: boolean;
  gatewayConfigured: boolean;
  setMode: (mode: SensorMode) => void;
  connectBle: () => Promise<void>;
  connectWifi: () => Promise<void>;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
}

const SensorContext = createContext<SensorContextValue | null>(null);

const MAX_HISTORY = 60;

export function SensorProvider({ children }: { children: ReactNode }) {
  const transports = useRef<Record<SensorMode, SensorTransport>>({
    demo: new DemoSensorTransport(),
    ble: new BleSensorTransport(),
    wifi: new WifiSensorTransport(),
  });

  const [mode, setModeState] = useState<SensorMode>("demo");
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [state, setState] = useState<ConnectionState>("DEMO MODE");
  const [error, setError] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const active = transports.current[mode];

  useEffect(() => {
    setError(null);
    setDeviceName(active.deviceName());
    const unsubscribe = active.subscribe(
      (next) => {
        setReading(next);
        setHistory((prev) => [...prev, next].slice(-MAX_HISTORY));
        setDeviceName(active.deviceName());
      },
      (nextState, err) => {
        setState(nextState);
        setError(err ?? null);
      },
    );
    return unsubscribe;
  }, [active]);

  const setMode = useCallback((next: SensorMode) => {
    setHistory([]);
    setReading(null);
    setModeState(next);
  }, []);

  const connectBle = useCallback(async () => {
    setModeState("ble");
    try {
      await transports.current.ble.connect();
      setDeviceName(transports.current.ble.deviceName());
      setState("CONNECTED");
      setError(null);
    } catch (err) {
      setState("ERROR");
      setError(err instanceof Error ? err.message : "BLE connection cancelled or failed.");
    }
  }, []);

  const connectWifi = useCallback(async () => {
    setModeState("wifi");
    try {
      await transports.current.wifi.connect();
      setState("CONNECTED");
      setError(null);
    } catch (err) {
      setState("ERROR");
      setError(err instanceof Error ? err.message : "Gateway connection failed.");
    }
  }, []);

  const disconnect = useCallback(async () => {
    await transports.current[mode].disconnect();
    setMode("demo");
  }, [mode, setMode]);

  const refresh = useCallback(async () => {
    await transports.current[mode].refresh();
  }, [mode]);

  const value = useMemo<SensorContextValue>(
    () => ({
      reading,
      history,
      state,
      mode,
      isDemo: mode === "demo",
      deviceName,
      error,
      bleSupported: transports.current.ble.isSupported(),
      gatewayConfigured: transports.current.wifi.isSupported(),
      setMode,
      connectBle,
      connectWifi,
      disconnect,
      refresh,
    }),
    [reading, history, state, mode, deviceName, error, setMode, connectBle, connectWifi, disconnect, refresh],
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
}

export function useSensors() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error("useSensors must be used inside <SensorProvider>");
  return ctx;
}