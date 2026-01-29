#!/usr/bin/env node
/**
 * Security rules and validation logic for command checking
 * @module security-rules
 */

const path = require('path');

const SECURITY_RULES = {
  CRITICAL_COMMANDS: ["del", "mkfs", "shred", "dd if=", "fdisk", "diskutil erase", "diskutil eraseDisk"],
  PRIVILEGE_COMMANDS: ["sudo", "su", "doas", "passwd"],
  NETWORK_COMMANDS: ["nc -l", "netcat -l"],
  DANGEROUS_PATTERNS: [
    /rm\s+.*-rf\s*\/\s*$/i,
    /rm\s+.*-rf\s*\/etc/i,
    /rm\s+.*-rf\s*\/usr/i,
    /rm\s+.*-rf\s*\/var/i,
    /rm\s+.*-rf\s*\/bin/i,
    /rm\s+.*-rf\s*\/sbin/i,
    />\s*\/dev\/(sda|hda|nvme)/i,
    /curl\s+.*\|\s*(sh|bash|zsh)/i,
    /wget\s+.*-O\s*-\s*\|\s*(sh|bash)/i,
  ],
  SAFE_RM_PATHS: [
    process.cwd(),
    path.join(process.env.HOME, ".claude"),
    path.join(process.env.HOME, "Developer"),
    path.join(process.env.HOME, "Downloads"),
    "/tmp",
    "/var/tmp",
    "node_modules",
    ".git",
  ]
};

/**
 * Extracts the actual command part, excluding heredoc content
 * @param {string} command - Full command string
 * @returns {string} Command without heredoc body
 */
function extractCommandPart(command) {
  const heredocMatch = command.match(/^([^<]*<<\s*['"]?(\w+)['"]?)/);
  if (heredocMatch) {
    return heredocMatch[1];
  }
  return command;
}

/**
 * Validates a command against security rules
 * @param {string} command - The command to validate
 * @returns {{isValid: boolean, violations: string[]}}
 */
function validateCommand(command) {
  const violations = [];
  const cmdPart = extractCommandPart(command);
  const tokens = cmdPart.split(/[\s|;&]+/).filter(t => t.length > 0);

  for (const criticalCmd of SECURITY_RULES.CRITICAL_COMMANDS) {
    if (tokens.some(t => t === criticalCmd || t.startsWith(criticalCmd + ' '))) {
      violations.push(`CRITICAL: Detected dangerous command '${criticalCmd}'`);
    }
  }

  for (const pattern of SECURITY_RULES.DANGEROUS_PATTERNS) {
    if (pattern.test(cmdPart)) {
      violations.push(`DANGEROUS PATTERN: ${pattern.toString()}`);
    }
  }

  // All rm commands require confirmation (permanent deletion)
  // But NOT trash/corbeille commands (recoverable)
  if (/\brm\s+/.test(cmdPart) && !/trash/i.test(cmdPart)) {
    violations.push(`DELETE: 'rm' supprime définitivement - confirmation required`);
  }
  // unlink is also permanent deletion
  if (/\bunlink\s+/.test(cmdPart)) {
    violations.push(`DELETE: 'unlink' command detected - confirmation required`);
  }
  // rmdir is safe (only removes empty dirs) - no confirmation needed

  for (const privCmd of SECURITY_RULES.PRIVILEGE_COMMANDS) {
    const regex = new RegExp(`(^|\\s|;|\\||&)${privCmd}(\\s|$|;|\\||&)`, 'i');
    if (regex.test(cmdPart)) {
      violations.push(`PRIVILEGE ESCALATION: ${privCmd}`);
    }
  }

  return { isValid: violations.length === 0, violations };
}

module.exports = { SECURITY_RULES, validateCommand };
