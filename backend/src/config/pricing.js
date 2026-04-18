/**
 * Central pricing configuration (PHP per sqm, by service tier).
 * Tune values here only — business logic lives in services/multipliers.
 */

export const defaultService = "Residential Development";

/** @typedef {"low"|"mid"|"high"} MaterialTier */

/**
 * Base construction rates per square meter, keyed by service type and material tier.
 * @type {Record<string, Record<MaterialTier, number>>}
 */
export const baseRates = {
  "Residential Development": {
    low: 18_000,
    mid: 25_000,
    high: 40_000,
  },
  "Commercial Construction": {
    low: 25_000,
    mid: 35_000,
    high: 55_000,
  },
  "Industrial Facility": {
    low: 32_000,
    mid: 45_000,
    high: 70_000,
  },
  "Infrastructure Project": {
    low: 60_000,
    mid: 85_000,
    high: 130_000,
  },
  "Renovation/Modernization": {
    low: 20_000,
    mid: 28_000,
    high: 45_000,
  },
  /**
   * Legacy option — kept for backward compatibility with older clients.
   * Estimator returns zero total when this service is selected.
   */
  "Consultation Services": {
    low: 0,
    mid: 0,
    high: 0,
  },
};

/** Default base rate (PHP/sqm) when service key is missing — mid tier of default service. */
export const fallbackBaseRatePerSqm =
  baseRates[defaultService]?.mid ?? 25_000;
