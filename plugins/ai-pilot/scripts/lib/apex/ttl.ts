/**
 * Shared enforcement TTL — override via FUSE_ENFORCE_TTL_SEC (seconds).
 * Robust parse: empty/NaN/float/zero/negative all fall back to the 120s (2 min) default.
 * Single source of truth for enforce-apex-phases, enforce-helpers, trivial-edit-counter.
 * Mirrors the Python parse in core-guards (int() rejects floats; isInteger keeps parity).
 */
const _ttlSec = Number(process.env.FUSE_ENFORCE_TTL_SEC);

/** Enforcement TTL in seconds (positive integer). Defaults to 120 (2 min). */
export const ENFORCE_TTL_SEC =
  Number.isInteger(_ttlSec) && _ttlSec > 0 ? _ttlSec : 120;

/** Enforcement TTL in milliseconds. */
export const ENFORCE_TTL_MS = ENFORCE_TTL_SEC * 1000;

/** Human label derived from the TTL: 120 -> "2min", 240 -> "4min", 90 -> "90s". */
export const TTL_LABEL =
  ENFORCE_TTL_SEC % 60 === 0 ? `${ENFORCE_TTL_SEC / 60}min` : `${ENFORCE_TTL_SEC}s`;
