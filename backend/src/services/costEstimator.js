import { z } from "zod";
import {
  baseRates,
  defaultService,
  fallbackBaseRatePerSqm,
} from "../config/pricing.js";
import {
  floorMultiplier,
  materialMultiplier,
  locationMultiplier,
  complexityMultiplier,
} from "../utils/multipliers.js";

const DISCLAIMER =
  "Preliminary estimate based on standard assumptions. Actual costs may vary depending on materials, design, and site conditions.";

/** Primary services supported by the multi-factor engine. */
const primaryServiceEnum = z.enum([
  "Residential Development",
  "Commercial Construction",
  "Industrial Facility",
  "Infrastructure Project",
  "Renovation/Modernization",
]);

/** Legacy alias — normalized to the same union for pricing lookup. */
const legacyServiceEnum = z.literal("Consultation Services");

const serviceSchema = z.union([primaryServiceEnum, legacyServiceEnum]);

export const estimateInputSchema = z
  .object({
    service: serviceSchema,
    /** Legacy clients may send under 10 sqm; clamped up to minimum buildable envelope. */
    areaSqm: z.preprocess((v) => {
      const n = typeof v === "string" ? Number(v) : v;
      if (typeof n !== "number" || !Number.isFinite(n)) return v;
      if (n > 0 && n < 10) return 10;
      return n;
    }, z.coerce.number().min(10).max(1_000_000)),
    floors: z.preprocess(
      (v) => (v === undefined || v === null || v === "" ? 1 : v),
      z.coerce.number().int().min(1),
    ),
    materialQuality: z.enum(["low", "mid", "high"]).default("mid"),
    location: z.enum(["cebu", "manila", "remote"]).default("cebu"),
    designComplexity: z
      .enum(["simple", "standard", "complex"])
      .default("standard"),
  })
  .strict();

const BREAKDOWN_SHARES = {
  materials: 0.55,
  labor: 0.25,
  permits: 0.1,
  misc: 0.1,
};

/**
 * Resolve PHP/sqm base rate from config with safe fallbacks.
 * @param {string} service
 * @param {"low"|"mid"|"high"} materialQuality
 */
export function resolveBaseRatePerSqm(service, materialQuality) {
  const svc = typeof service === "string" && service in baseRates ? service : defaultService;
  const tiers = baseRates[svc];
  if (!tiers) {
    return fallbackBaseRatePerSqm;
  }
  const tier = materialQuality in tiers ? materialQuality : "mid";
  const raw = tiers[tier];
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallbackBaseRatePerSqm;
}

/**
 * Core multi-factor estimate.
 * Total = area × baseRate × floor × material × location × complexity
 * @param {z.infer<typeof estimateInputSchema>} input
 */
export function estimateCost(input) {
  const baseRate = resolveBaseRatePerSqm(input.service, input.materialQuality);
  const fm = floorMultiplier(input.floors);
  const mm = materialMultiplier(input.materialQuality);
  const lm = locationMultiplier(input.location);
  const cm = complexityMultiplier(input.designComplexity);

  const area = Number(input.areaSqm);
  const safeArea = Number.isFinite(area) ? area : 0;

  const product =
    safeArea *
    baseRate *
    fm *
    mm *
    lm *
    cm;

  const totalCost = Math.round(Number.isFinite(product) ? product : 0);

  const breakdown = {
    materials: Math.round(totalCost * BREAKDOWN_SHARES.materials),
    labor: Math.round(totalCost * BREAKDOWN_SHARES.labor),
    permits: Math.round(totalCost * BREAKDOWN_SHARES.permits),
    misc: Math.round(totalCost * BREAKDOWN_SHARES.misc),
  };

  const drift =
    totalCost -
    (breakdown.materials +
      breakdown.labor +
      breakdown.permits +
      breakdown.misc);
  if (drift !== 0) {
    breakdown.materials += drift;
  }

  return {
    totalCost,
    breakdown,
    meta: {
      baseRatePerSqm: baseRate,
      multipliers: {
        floor: fm,
        material: mm,
        location: lm,
        complexity: cm,
      },
    },
  };
}

/**
 * Placeholder for future AI-backed narrative (factors, recommendations, optimization).
 * @param {z.infer<typeof estimateInputSchema>} input
 * @param {ReturnType<typeof estimateCost>} result
 */
export function generateExplanation(input, result) {
  return {
    status: "not_implemented",
    message:
      "Reserved for AI integration: factor explanations, recommendations, and cost optimization tips.",
    inputSummary: {
      service: input?.service,
      areaSqm: input?.areaSqm,
    },
    resultSummary: {
      totalCost: result?.totalCost,
    },
  };
}

/**
 * Validates body, runs engine, returns API payload.
 * @param {unknown} rawBody
 */
export function runEstimateFromRequestBody(rawBody) {
  const inputs = estimateInputSchema.parse(rawBody);
  const engine = estimateCost(inputs);
  // Stub hook for future AI narrative (kept out of HTTP payload until integrated).
  void generateExplanation(inputs, engine);

  return {
    ok: true,
    currency: "PHP",
    inputs,
    totalCost: engine.totalCost,
    breakdown: engine.breakdown,
    disclaimer: DISCLAIMER,
  };
}
