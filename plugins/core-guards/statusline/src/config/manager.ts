/**
 * Config Manager - Statusline configuration management
 *
 * @description Loads and validates the configuration from a JSON file
 * Applies SRP: single responsibility of config management
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defaultConfig, type StatuslineConfig, StatuslineConfigSchema } from "./schema";

const STATUSLINE_ROOT = join(dirname(__dirname), "..");
/** Default config shipped with the plugin (read-only, git tracked). */
const DEFAULT_CONFIG = join(STATUSLINE_ROOT, "config.json");
/** User overrides saved by the configurator (gitignored). */
const USER_CONFIG = join(STATUSLINE_ROOT, "user-config.json");

/**
 * Configuration manager interface
 * Applies DIP: depend on an abstraction
 */
export interface IConfigManager {
	load(): Promise<StatuslineConfig>;
	save(config: StatuslineConfig): Promise<void>;
	reset(): Promise<StatuslineConfig>;
}

/**
 * Statusline configuration manager
 */
export class ConfigManager implements IConfigManager {
	/**
	 * Loads the configuration from file
	 * Priority: USER_CONFIG > DEFAULT_CONFIG > defaultConfig
	 */
	async load(): Promise<StatuslineConfig> {
		try {
			// 1. User config (highest priority)
			if (existsSync(USER_CONFIG)) {
				const content = readFileSync(USER_CONFIG, "utf-8");
				return StatuslineConfigSchema.parse(JSON.parse(content));
			}

			// 2. Plugin config
			if (existsSync(DEFAULT_CONFIG)) {
				const content = readFileSync(DEFAULT_CONFIG, "utf-8");
				return StatuslineConfigSchema.parse(JSON.parse(content));
			}

			// 3. Default config
			return defaultConfig;
		} catch (error) {
			console.error(`Config error: ${error}`);
			return defaultConfig;
		}
	}

	/**
	 * Saves the configuration to the user file
	 */
	async save(config: StatuslineConfig): Promise<void> {
		const validated = StatuslineConfigSchema.parse(config);
		writeFileSync(USER_CONFIG, JSON.stringify(validated, null, 2));
	}

	/**
	 * Resets the configuration to default values
	 */
	async reset(): Promise<StatuslineConfig> {
		await this.save(defaultConfig);
		return defaultConfig;
	}
}
