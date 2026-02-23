/**
 * Reference routing interfaces for metadata-aware SOLID reference filtering.
 */

/** Parsed frontmatter metadata from a reference .md file */
export interface RefMeta {
  name: string;
  description: string;
  keywords: string;
  priority: string;
  related: string;
  appliesTo: string;
  triggerOnEdit: string;
  level: string;
  filePath: string;
}

/** Reference with its computed routing score */
export interface ScoredRef {
  meta: RefMeta;
  score: number;
}

/** Routing result with categorized references */
export interface RouteResult {
  required: ScoredRef[];
  optional: ScoredRef[];
  skillPath: string;
}
