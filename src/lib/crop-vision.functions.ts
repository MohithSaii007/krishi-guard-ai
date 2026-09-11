import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  imageDataUrl: z.string().min(32).max(9_000_000),
  note: z.string().max(500).optional(),
  context: z.string().max(500).optional(),
});

export interface CropDiagnosis {
  crop: string;
  condition: string;
  severity: "healthy" | "mild" | "moderate" | "severe" | "unknown";
  confidence: number;
  situation: string;
  symptoms: string[];
  causes: string[];
  actions: string[];
  prevention: string[];
}

const RESPONSE_SHAPE = `{
  "crop": string,
  "condition": string,
  "severity": "healthy" | "mild" | "moderate" | "severe" | "unknown",
  "confidence": number between 0 and 100,
  "situation": string (2-3 short sentences on the current situation of this crop),
  "symptoms": string[],
  "causes": string[],
  "actions": string[] (practical steps an Indian smallholder farmer can do now, low cost first),
  "prevention": string[]
}`;

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return a readable result.");
  return JSON.parse(raw.slice(start, end + 1)) as CropDiagnosis;
}

export const analyzeCropImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<CropDiagnosis> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI service is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an experienced Indian agronomist and plant pathologist. Look at the crop photo and report the plant's current situation: crop type, health, any disease/pest/nutrient problem, and what the farmer should do. Be specific and practical. Reply with JSON only, no prose, matching this shape: " +
              RESPONSE_SHAPE,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: [
                  "Analyse this crop photo and tell me the current situation of the crop.",
                  data.note ? `Farmer's note: ${data.note}` : "",
                  data.context ? `Live field sensor readings: ${data.context}` : "",
                ]
                  .filter(Boolean)
                  .join("\n"),
              },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Too many photo checks right now. Please try again in a minute.");
    if (res.status === 402) throw new Error("AI credits are exhausted. Please top up to keep using photo checks.");
    if (!res.ok) throw new Error(`Photo check failed (${res.status}). Please try again.`);

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content);

    return {
      crop: parsed.crop || "Unknown crop",
      condition: parsed.condition || "Not identified",
      severity: parsed.severity ?? "unknown",
      confidence: Number(parsed.confidence ?? 0),
      situation: parsed.situation || "",
      symptoms: parsed.symptoms ?? [],
      causes: parsed.causes ?? [],
      actions: parsed.actions ?? [],
      prevention: parsed.prevention ?? [],
    };
  });
