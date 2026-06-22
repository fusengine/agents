/**
 * Shared SOLID max-lines limit — override via FUSE_SOLID_MAX_LINES.
 * Robust parse: empty/NaN/float/zero/negative all fall back to the 100 default.
 * Mirrors the Python parse in core-guards/ai-pilot (int() rejects floats;
 * Number.isInteger + non-empty guard keeps parity since Number("") === 0).
 */
const _max = Number(process.env.FUSE_SOLID_MAX_LINES);

/** SOLID max lines per file (positive integer). Defaults to 100. */
export const SOLID_MAX_LINES =
  Number.isInteger(_max) && _max > 0 ? _max : 100;

/** Advisory module-split headroom = SOLID_MAX_LINES - 10 (default 90). */
export const SOLID_SPLIT_TARGET = Math.max(SOLID_MAX_LINES - 10, 1);
