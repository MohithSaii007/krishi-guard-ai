export interface ForecastDay {
  day: string;
  condition: string;
  high: number;
  low: number;
  rainProbability: number;
}

export interface WeatherSnapshot {
  temperature: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  condition: string;
  source: "demo" | "live";
  forecast: ForecastDay[];
}

const WEATHER_KEY = import.meta.env['VITE_WEATHER_API_KEY'] as string | undefined;
const WEATHER_URL = import.meta.env['VITE_WEATHER_API_URL'] as string | undefined;

export const weatherConfigured = Boolean(WEATHER_KEY && WEATHER_URL);

const DAYS = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
const CONDITIONS = ["Sunny", "Partly Cloudy", "Cloudy", "Light Showers", "Clear"];

export function demoWeather(seed = 0): WeatherSnapshot {
  const wobble = (n: number) => Math.round(n + Math.sin(seed) * 2);
  return {
    temperature: wobble(31),
    humidity: wobble(58),
    rainProbability: Math.max(0, wobble(18)),
    windSpeed: Math.max(2, wobble(9)),
    condition: "Partly Cloudy",
    source: "demo",
    forecast: DAYS.map((day, i) => ({
      day,
      condition: CONDITIONS[i % CONDITIONS.length]!,
      high: 30 + ((i * 3) % 5),
      low: 21 + (i % 3),
      rainProbability: [10, 20, 45, 65, 15][i]!,
    })),
  };
}

/**
 * Fetches live weather when VITE_WEATHER_API_URL and VITE_WEATHER_API_KEY are set,
 * otherwise returns clearly-labelled demo weather.
 */
export async function fetchWeather(): Promise<WeatherSnapshot> {
  if (!weatherConfigured) return demoWeather(Date.now() / 6e5);
  try {
    const res = await fetch(`${WEATHER_URL}&appid=${WEATHER_KEY}`);
    if (!res.ok) throw new Error("weather request failed");
    const json = (await res.json()) as Record<string, unknown>;
    const main = (json['main'] ?? {}) as Record<string, number>;
    const wind = (json['wind'] ?? {}) as Record<string, number>;
    const weatherArr = (json['weather'] ?? []) as Array<{ main?: string }>;
    return {
      temperature: Math.round(main['temp'] ?? 0),
      humidity: Math.round(main['humidity'] ?? 0),
      rainProbability: Math.round(((json['pop'] as number) ?? 0) * 100),
      windSpeed: Math.round(wind['speed'] ?? 0),
      condition: weatherArr[0]?.main ?? "Unknown",
      source: "live",
      forecast: demoWeather().forecast,
    };
  } catch {
    return demoWeather(Date.now() / 6e5);
  }
}