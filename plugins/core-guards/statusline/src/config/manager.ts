/**
 * Config Manager - Gestion de la configuration du statusline
 *
 * @description Charge et valide la configuration depuis un fichier JSON
 * Applique le principe SRP: responsabilite unique de gestion de config
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import {
	StatuslineConfigSchema,
	defaultConfig,
	type StatuslineConfig,
} from "./schema";

const CONFIG_DIR = join(homedir(), ".claude", "scripts", "statusline");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

/**
 * Interface pour le gestionnaire de configuration
 * Applique le principe DIP: dependance sur abstraction
 */
export interface IConfigManager {
	load(): Promise<StatuslineConfig>;
	save(config: StatuslineConfig): Promise<void>;
	reset(): Promise<void>;
}

/**
 * Gestionnaire de configuration du statusline
 */
export class ConfigManager implements IConfigManager {
	private configPath: string;

	constructor(configPath: string = CONFIG_FILE) {
		this.configPath = configPath;
	}

	/**
	 * Charge la configuration depuis le fichier
	 * Retourne la config par defaut si le fichier n'existe pas
	 */
	async load(): Promise<StatuslineConfig> {
		try {
			if (!existsSync(this.configPath)) {
				return defaultConfig;
			}

			const content = readFileSync(this.configPath, "utf-8");
			const parsed = JSON.parse(content);

			// Valide et complete avec les valeurs par defaut
			return StatuslineConfigSchema.parse(parsed);
		} catch (error) {
			console.error(`Config error: ${error}`);
			return defaultConfig;
		}
	}

	/**
	 * Sauvegarde la configuration dans le fichier
	 */
	async save(config: StatuslineConfig): Promise<void> {
		const validated = StatuslineConfigSchema.parse(config);
		writeFileSync(this.configPath, JSON.stringify(validated, null, 2));
	}

	/**
	 * Reinitialise la configuration aux valeurs par defaut
	 */
	async reset(): Promise<StatuslineConfig> {
		await this.save(defaultConfig);
		return defaultConfig;
	}
}
