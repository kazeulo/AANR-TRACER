export const SCALES = [0.9, 1, 1.1, 1.2, 1.3] as const;
export const LABELS = ["Small", "Default", "Large", "X-Large", "XX-Large"] as const;
export const DEFAULT_INDEX = 1;
export const SCALE_STORAGE_KEY = "aanr-font-scale";
export const TOOLTIP_SEEN_KEY  = "aanr-fontsize-tooltip-seen"; // was "rrc-" — fixed

// Compile-time guard: adding a scale without a label (or vice versa) is now a type error
type AssertSameLength<A extends readonly unknown[], B extends readonly unknown[]> =
  A["length"] extends B["length"] ? true : never;
export const _assertScaleLabelParity: AssertSameLength<typeof SCALES, typeof LABELS> = true;