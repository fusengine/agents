/**
 * Cache-related interfaces for doc, test, and lesson caching.
 */

/** Index file for document cache (per-project) */
export interface CacheIndex {
  project: string;
  docs: CacheEntry[];
}

/** Single cached document entry in the index */
export interface CacheEntry {
  hash: string;
  library: string;
  topic: string;
  timestamp: string;
  size_kb: number;
}

/** Lesson entry extracted from sniper transcripts */
export interface LessonEntry {
  error_type: string;
  pattern: string;
  fix: string;
  count: number;
  last_seen: string;
  files: string[];
  code: { line: string[] };
}

/** Cached test result for a single source file */
export interface TestResult {
  checksum: string;
  eslint: "pass" | "fail";
  tsc: "pass" | "fail";
  last_tested: string;
}

/** Edit entry extracted from a sniper transcript */
export interface EditEntry {
  file: string;
  oldStr: string;
  newStr: string;
}

/** Test cache structure stored on disk */
export interface TestCache {
  timestamp: string;
  files: Record<string, TestResult>;
}
