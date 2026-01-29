/**
 * Service de gestion des variables d'environnement
 * Configure les API keys avec @clack/prompts
 * Support: bash, zsh, fish, PowerShell (macOS/Linux/Windows)
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import * as p from "@clack/prompts";
import { API_KEYS } from "../config/api-keys";

const HOME = process.env.HOME || process.env.USERPROFILE || "";
const IS_WINDOWS = process.platform === "win32";
const ENV_FILE = join(HOME, ".claude", ".env");
const SCRIPT_DIR = dirname(dirname(dirname(import.meta.path)));
const ENV_SHELL_DIR = join(SCRIPT_DIR, "env-shell");

/**
 * Lit les variables existantes du fichier .env
 */
export function loadEnvFile(): Record<string, string> {
  if (!existsSync(ENV_FILE)) return {};

  const content = readFileSync(ENV_FILE, "utf8");
  const env: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const match = line.match(/^export\s+(\w+)=["']?([^"'\n]*)["']?/);
    if (match) {
      env[match[1]] = match[2];
    }
  }

  return env;
}

/**
 * Sauvegarde les variables dans le fichier .env
 */
export function saveEnvFile(env: Record<string, string>): void {
  mkdirSync(dirname(ENV_FILE), { recursive: true });
  const lines = Object.entries(env)
    .filter(([_, value]) => value)
    .map(([key, value]) => `export ${key}="${value}"`);

  writeFileSync(ENV_FILE, lines.join("\n") + "\n");
}

/**
 * Configure les API keys avec prompts
 */
export async function configureApiKeys(): Promise<void> {
  const existing = loadEnvFile();
  const updated: Record<string, string> = { ...existing };
  let hasChanges = false;

  p.intro("🔑 Configuration des API keys");

  for (const key of API_KEYS) {
    const current = existing[key.name];

    if (current) {
      p.log.success(`${key.name} - configuré`);
      continue;
    }

    const value = await p.text({
      message: `${key.name}`,
      placeholder: key.description,
    });

    if (p.isCancel(value)) {
      p.cancel("Configuration annulée");
      return;
    }

    if (value && value.trim()) {
      updated[key.name] = value.trim();
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveEnvFile(updated);
    p.log.success(`Sauvegardé dans ${ENV_FILE}`);
  }

  p.outro("✅ API keys configurées");
}

/**
 * Vérifie si les API keys sont configurées
 */
export function checkApiKeys(): { configured: string[]; missing: string[] } {
  const env = loadEnvFile();
  const configured: string[] = [];
  const missing: string[] = [];

  for (const key of API_KEYS) {
    if (env[key.name]) {
      configured.push(key.name);
    } else {
      missing.push(key.name);
    }
  }

  return { configured, missing };
}

/**
 * Détecte le shell de l'utilisateur
 */
function detectShell(): "bash" | "zsh" | "fish" | "pwsh" {
  // Windows → PowerShell par défaut
  if (IS_WINDOWS) return "pwsh";

  const shell = process.env.SHELL?.split("/").pop() || "bash";
  if (shell === "fish") return "fish";
  if (shell === "zsh") return "zsh";
  if (shell === "pwsh" || shell === "powershell") return "pwsh";
  return "bash";
}

/**
 * Retourne le chemin du profile PowerShell selon l'OS
 */
function getPowershellProfilePath(): string {
  if (IS_WINDOWS) {
    // Windows: Documents\PowerShell\Microsoft.PowerShell_profile.ps1
    return join(HOME, "Documents", "PowerShell", "Microsoft.PowerShell_profile.ps1");
  }
  // macOS/Linux: .config/powershell/Microsoft.PowerShell_profile.ps1
  return join(HOME, ".config", "powershell", "Microsoft.PowerShell_profile.ps1");
}

/**
 * Configure le shell pour charger .env automatiquement
 */
export async function configureShell(): Promise<void> {
  const shell = detectShell();

  // Vérifier si déjà configuré
  if (isShellConfigured(shell)) {
    p.log.info(`${shell} déjà configuré`);
    return;
  }

  const shouldConfigure = await p.confirm({
    message: `Configurer ${shell} pour charger automatiquement les API keys ?`,
  });

  if (p.isCancel(shouldConfigure) || !shouldConfigure) return;

  switch (shell) {
    case "fish":
      installFishConfig();
      break;
    case "pwsh":
      installPowershellConfig();
      break;
    default:
      installPosixConfig(shell);
  }

  p.log.success(`${shell} configuré`);
}

/**
 * Vérifie si le shell est déjà configuré
 */
function isShellConfigured(shell: string): boolean {
  switch (shell) {
    case "fish": {
      const fishConf = join(HOME, ".config", "fish", "conf.d", "claude-env.fish");
      return existsSync(fishConf);
    }
    case "pwsh": {
      const psProfile = getPowershellProfilePath();
      if (!existsSync(psProfile)) return false;
      return readFileSync(psProfile, "utf8").includes("claude");
    }
    default: {
      const rcFile = join(HOME, shell === "zsh" ? ".zshrc" : ".bashrc");
      if (!existsSync(rcFile)) return false;
      return readFileSync(rcFile, "utf8").includes("claude");
    }
  }
}

/**
 * Installe la config fish
 */
function installFishConfig(): void {
  const confDir = join(HOME, ".config", "fish", "conf.d");
  mkdirSync(confDir, { recursive: true });
  copyFileSync(
    join(ENV_SHELL_DIR, "claude-env.fish"),
    join(confDir, "claude-env.fish")
  );
}

/**
 * Installe la config PowerShell
 */
function installPowershellConfig(): void {
  const profileFile = getPowershellProfilePath();
  mkdirSync(dirname(profileFile), { recursive: true });

  const psConfig = readFileSync(join(ENV_SHELL_DIR, "claude-env.ps1"), "utf8");

  if (existsSync(profileFile)) {
    const existing = readFileSync(profileFile, "utf8");
    writeFileSync(profileFile, existing + "\n" + psConfig);
  } else {
    writeFileSync(profileFile, psConfig);
  }
}

/**
 * Installe la config bash/zsh
 */
function installPosixConfig(shell: "bash" | "zsh"): void {
  const rcFile = join(HOME, shell === "zsh" ? ".zshrc" : ".bashrc");
  const sourceBlock = readFileSync(
    join(ENV_SHELL_DIR, `claude-env.${shell}`),
    "utf8"
  );

  if (existsSync(rcFile)) {
    const existing = readFileSync(rcFile, "utf8");
    writeFileSync(rcFile, existing + "\n" + sourceBlock);
  } else {
    writeFileSync(rcFile, sourceBlock);
  }
}
