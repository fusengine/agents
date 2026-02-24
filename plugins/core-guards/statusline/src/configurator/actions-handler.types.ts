/**
 * Actions Handler Types - Type definitions for config actions
 *
 * Responsibility: Interface Segregation Principle (ISP)
 * - Separated type definitions from implementation
 */

import type { StatuslineConfig } from "../config/schema";

/**
 * Action type returned by action menu
 */
export type ConfigAction = "continue" | "save" | "reset" | "cancel";

/**
 * Action result returned by handlers
 */
export interface ActionResult {
	shouldContinue: boolean;
	config: StatuslineConfig;
}
