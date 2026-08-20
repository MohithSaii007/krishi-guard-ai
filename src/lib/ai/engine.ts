import { statusOf, type SensorKey, type SensorReading } from "@/lib/sensors/types";
import type { WeatherSnapshot } from "@/lib/weather";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export interface Recommendation {
  id: string;
  title: string;
  risk: RiskLevel;
  whatHappened: string;
  why: string;
  whatToDo: string;
  icon: string;
}

/**
 * Transparent, rule-based decision logic. This is NOT a trained ML model — every
 * output below is produced by the readable rules in this file, so agronomists can
 * tune thresholds without retraining anything.
 */
export function runDecisionEngine(reading: SensorReading | null, weather: WeatherSnapshot | null): Recommendation[] {
  if (!reading) return [];
  const out: Recommendation[] = [];
  const rain = weather?.rainProbability ?? 0;

  if (reading.soilMoisture < 25 && rain < 40) {
    out.push({
      id: "irrigation",
      title: "Irrigation Recommended",
      risk: reading.soilMoisture < 18 ? "HIGH" : "MODERATE",
      whatHappened: "Soil moisture is low.",
      why: `The field is dry (${reading.soilMoisture}% moisture) and rainfall probability is only ${rain}%.`,
      whatToDo: "Irrigate the field now, preferably in the early morning or evening.",
      icon: "💧",
    });
  }

  if (reading.soilPH < 5.5 || reading.soilPH > 8) {
    out.push({
      id: "ph",
      title: "Check Soil pH",
      risk: "MODERATE",
      whatHappened: `Soil pH is ${reading.soilPH}, outside the healthy range.`,
      why: reading.soilPH < 5.5 ? "The soil has turned acidic." : "The soil has turned alkaline.",
      whatToDo: reading.soilPH < 5.5 ? "Apply agricultural lime and re-test after a week." : "Apply gypsum or organic matter and re-test after a week.",
      icon: "🧪",
    });
  }

  if (reading.nitrogen < 35) {
    out.push({
      id: "nitrogen",
      title: "Possible Nitrogen Deficiency",
      risk: reading.nitrogen < 25 ? "HIGH" : "MODERATE",
      whatHappened: `Nitrogen is ${reading.nitrogen} mg/kg — below the preferred level.`,
      why: "Crops are using nitrogen faster than the soil can supply it.",
      whatToDo: "Apply a nitrogen-rich fertiliser such as urea in a split dose.",
      icon: "🌱",
    });
  }

  if (reading.phosphorus < 20 || reading.potassium < 25) {
    out.push({
      id: "npk",
      title: "Nutrient Balance Needs Attention",
      risk: "MODERATE",
      whatHappened: "Phosphorus or potassium levels are low.",
      why: `P is ${reading.phosphorus} mg/kg and K is ${reading.potassium} mg/kg.`,
      whatToDo: "Apply a balanced NPK mix as advised by your local agriculture officer.",
      icon: "⚖️",
    });
  }

  if (reading.temperature > 35 && reading.humidity < 40) {
    out.push({
      id: "heat",
      title: "High Heat Stress Risk",
      risk: "HIGH",
      whatHappened: `Temperature is ${reading.temperature}°C with only ${reading.humidity}% humidity.`,
      why: "Hot, dry air pulls moisture out of the crop faster than the roots can replace it.",
      whatToDo: "Irrigate lightly, add mulch and avoid spraying during peak afternoon heat.",
      icon: "🌡️",
    });
  }

  if (reading.humidity > 85 && reading.temperature > 24) {
    out.push({
      id: "disease",
      title: "Fungal Disease Risk",
      risk: "MODERATE",
      whatHappened: "The field is warm and very humid.",
      why: `Humidity is ${reading.humidity}% — ideal conditions for leaf fungus.`,
      whatToDo: "Inspect lower leaves and keep a preventive bio-fungicide ready.",
      icon: "🦠",
    });
  }

  if (reading.waterLevel < 25) {
    out.push({
      id: "water",
      title: "Water Storage Running Low",
      risk: reading.waterLevel < 15 ? "HIGH" : "MODERATE",
      whatHappened: `Water tank / borewell level is at ${reading.waterLevel}%.`,
      why: "Continuous irrigation has drawn down the stored water.",
      whatToDo: "Refill storage before the next irrigation cycle.",
      icon: "🚰",
    });
  }

  if (out.length === 0) {
    out.push({
      id: "healthy",
      title: "Field Conditions Are Healthy",
      risk: "LOW",
      whatHappened: "All sensor values are inside their healthy range.",
      why: "Soil moisture, pH, nutrients and weather are all balanced right now.",
      whatToDo: "No action needed. Keep monitoring.",
      icon: "✅",
    });
  }

  return out;
}

export interface AlertItem {
  severity: "critical" | "warning" | "healthy";
  title: string;
  message: string;
}

export function buildAlerts(reading: SensorReading | null): AlertItem[] {
  if (!reading) return [];
  const keys: SensorKey[] = [
    "soilMoisture",
    "soilPH",
    "nitrogen",
    "phosphorus",
    "potassium",
    "temperature",
    "humidity",
    "waterLevel",
  ];
  const labels: Record<SensorKey, string> = {
    soilMoisture: "Soil moisture",
    soilPH: "Soil pH",
    nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    potassium: "Potassium",
    temperature: "Temperature",
    humidity: "Humidity",
    waterLevel: "Water level",
  };
  return keys.map((key) => {
    const status = statusOf(key, reading[key]);
    if (status === "critical")
      return { severity: "critical" as const, title: `${labels[key]} is critical`, message: `${labels[key]} is far outside the recommended range.` };
    if (status === "warning")
      return { severity: "warning" as const, title: `${labels[key]} needs attention`, message: `${labels[key]} is drifting away from the recommended range.` };
    return { severity: "healthy" as const, title: `${labels[key]} is healthy`, message: `${labels[key]} is within the recommended range.` };
  });
}

export interface HealthScore {
  total: number;
  soil: number;
  water: number;
  crop: number;
  weather: number;
  nutrients: number;
  label: string;
}

function band(value: number, min: number, max: number) {
  if (value >= min && value <= max) return 95;
  const span = max - min || 1;
  const distance = value < min ? min - value : value - max;
  return Math.max(35, Math.round(95 - (distance / span) * 90));
}

export function computeHealthScore(reading: SensorReading | null, weather: WeatherSnapshot | null): HealthScore {
  if (!reading) {
    return { total: 0, soil: 0, water: 0, crop: 0, weather: 0, nutrients: 0, label: "No data" };
  }
  const soil = Math.round((band(reading.soilMoisture, 25, 60) + band(reading.soilPH, 6, 7.5)) / 2);
  const water = band(reading.waterLevel, 40, 100);
  const nutrients = Math.round(
    (band(reading.nitrogen, 40, 80) + band(reading.phosphorus, 25, 60) + band(reading.potassium, 35, 80)) / 3,
  );
  const weatherScore = Math.round(
    (band(reading.temperature, 18, 32) + band(reading.humidity, 50, 80) + (weather ? band(weather.rainProbability, 20, 70) : 85)) / 3,
  );
  const crop = Math.round((soil * 0.4 + nutrients * 0.4 + weatherScore * 0.2));
  const total = Math.round(soil * 0.25 + water * 0.2 + crop * 0.2 + weatherScore * 0.15 + nutrients * 0.2);
  const label = total >= 80 ? "Healthy" : total >= 60 ? "Needs Attention" : "At Risk";
  return { total, soil, water, crop, weather: weatherScore, nutrients, label };
}