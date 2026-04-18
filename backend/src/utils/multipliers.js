/**
 * Independent multipliers — one function per cost factor.
 * Each returns a single scalar; combine in the estimator service only.
 */

/** @param {number} floors */
export function floorMultiplier(floors) {
  const f = Number.isFinite(floors) ? Math.max(1, Math.floor(floors)) : 1;
  if (f <= 1) return 1.0;
  if (f === 2) return 1.15;
  if (f === 3) return 1.3;
  return 1.5;
}

/** @param {"low"|"mid"|"high"} materialQuality */
export function materialMultiplier(materialQuality) {
  switch (materialQuality) {
    case "low":
      return 0.9;
    case "high":
      return 1.25;
    case "mid":
    default:
      return 1.0;
  }
}

/** @param {"cebu"|"manila"|"remote"} location */
export function locationMultiplier(location) {
  switch (location) {
    case "manila":
      return 1.2;
    case "remote":
      return 1.1;
    case "cebu":
    default:
      return 1.0;
  }
}

/** @param {"simple"|"standard"|"complex"} designComplexity */
export function complexityMultiplier(designComplexity) {
  switch (designComplexity) {
    case "simple":
      return 0.95;
    case "complex":
      return 1.1;
    case "standard":
    default:
      return 1.0;
  }
}
