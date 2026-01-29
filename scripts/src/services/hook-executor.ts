/**
 * Service d'exécution des hooks
 * Single Responsibility: Exécuter les commandes et collecter les résultats
 */
import type { ExecutableHook, HookResult } from "../interfaces/hooks";

/**
 * Exécute un hook et retourne le résultat
 */
export async function executeHook(
  hook: ExecutableHook,
  input: string
): Promise<HookResult> {
  if (hook.isAsync) {
    // Fire and forget pour les sons
    Bun.spawn(["bash", "-c", hook.command], {
      stdout: "ignore",
      stderr: "ignore",
    });

    return {
      success: true,
      exitCode: 0,
      stdout: "",
      stderr: "",
      blocked: false,
    };
  }

  const proc = Bun.spawn(["bash", "-c", hook.command], {
    stdin: new TextEncoder().encode(input),
    stdout: "pipe",
    stderr: "pipe",
  });

  const exitCode = await proc.exited;
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  return {
    success: exitCode === 0,
    exitCode,
    stdout,
    stderr,
    blocked: exitCode === 2,
  };
}

/**
 * Exécute une liste de hooks en PARALLÈLE
 * Vérifie les blocages après exécution
 */
export async function executeHooks(
  hooks: ExecutableHook[],
  input: string
): Promise<{ blocked: boolean; stderr: string; output: string }> {
  if (hooks.length === 0) {
    return { blocked: false, stderr: "", output: "" };
  }

  // Exécuter tous les hooks en parallèle
  const results = await Promise.all(
    hooks.map((hook) => executeHook(hook, input))
  );

  // Vérifier si un hook a bloqué
  const blockedResult = results.find((r) => r.blocked);
  if (blockedResult) {
    return {
      blocked: true,
      stderr: blockedResult.stderr,
      output: "",
    };
  }

  // Collecter tous les outputs JSON
  let collectedOutput = "";
  for (const result of results) {
    if (result.stdout.trim()) {
      collectedOutput = mergeJsonOutput(collectedOutput, result.stdout);
    }
  }

  return {
    blocked: false,
    stderr: "",
    output: collectedOutput,
  };
}

/**
 * Fusionne les outputs JSON avec additionalContext
 */
function mergeJsonOutput(existing: string, newOutput: string): string {
  try {
    const json = JSON.parse(newOutput);
    if (!json.additionalContext) return existing;

    if (!existing) return newOutput;

    const existingJson = JSON.parse(existing);
    existingJson.additionalContext += "\n\n" + json.additionalContext;
    return JSON.stringify(existingJson);
  } catch {
    return existing;
  }
}
