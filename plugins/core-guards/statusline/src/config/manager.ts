/**
 * Config Manager - Gestion de la configuration du statusline
 *
 * @description Charge et valide la configuration depuis un fichier JSON
 * Applique le principe SRP: responsabilite unique de gestion de config
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { defaultConfig, type StatuslineConfig, StatuslineConfigSchema } from "./schema";

// Config du plugin (relatif au script installe)
const PLUGIN_CONFIG = join(dirname(__dirname), "..", "config.json");
// Config utilisateur pour overrides (optionnel)
const USER_CONFIG = join(homedir(), ".claude", "scripts", "statusline", "config.json");

/**
 * Interface pour le gestionnaire de configuration
 * Applique le principe DIP: dependance sur abstraction
 */
export interface IConfigManager {
	load(): Promise<StatuslineConfig>;
	save(config: StatuslineConfig): Promise<void>;
	reset(): Promise<StatuslineConfig>;
}

/**
 * Gestionnaire de configuration du statusline
 */
export class ConfigManager implements IConfigManager {
	/**
	 * Charge la configuration depuis le fichier
	 * Priorite: USER_CONFIG > PLUGIN_CONFIG > defaultConfig
	 */
	async load(): Promise<StatuslineConfig> {
		try {
			// 1. Config utilisateur (prioritaire)
			if (existsSync(USER_CONFIG)) {
				const content = readFileSync(USER_CONFIG, "utf-8");
				return StatuslineConfigSchema.parse(JSON.parse(content));
			}

			// 2. Config du plugin
			if (existsSync(PLUGIN_CONFIG)) {
				const content = readFileSync(PLUGIN_CONFIG, "utf-8");
				return StatuslineConfigSchema.parse(JSON.parse(content));
			}

			// 3. Config par defaut
			return defaultConfig;
		} catch (error) {
			console.error(`Config error: ${error}`);
			return defaultConfig;
		}
	}

	/**
	 * Sauvegarde la configuration dans le fichier utilisateur
	 */
	async save(config: StatuslineConfig): Promise<void> {
		const validated = StatuslineConfigSchema.parse(config);
		writeFileSync(USER_CONFIG, JSON.stringify(validated, null, 2));
	}

	/**
	 * Reinitialise la configuration aux valeurs par defaut
	 */
	async reset(): Promise<StatuslineConfig> {
		await this.save(defaultConfig);
		return defaultConfig;
	}
}
