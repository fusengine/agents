#!/usr/bin/env node
/**
 * Command validator for PreToolUse hook
 * Reads command from stdin and validates against security rules
 * @module validate-command
 */

const fs = require('fs');
const path = require('path');
const { validateCommand } = require('./security-rules');

// Read from stdin
let stdinData = '';
try {
  stdinData = fs.readFileSync(0, 'utf-8');
} catch (e) { /* empty stdin */ }

// Debug logging
const debugPath = path.join(process.env.HOME, ".claude", "logs", "hook-debug.log");
fs.appendFileSync(debugPath, `${new Date().toISOString()} STDIN: ${stdinData || 'EMPTY'}\n`);

// Parse input
let toolInput = {};
if (stdinData) {
  try { toolInput = JSON.parse(stdinData); } catch (e) { /* invalid JSON */ }
}

// Extract command
const command = toolInput?.tool_input?.command || toolInput?.command || process.argv[2] || '';
const result = validateCommand(command);

// Log all commands
const logPath = path.join(process.env.HOME, ".claude", "logs", "security.log");
const logEntry = {
  timestamp: new Date().toISOString(),
  command,
  severity: result.isValid ? "INFO" : "CRITICAL",
  action: result.isValid ? "ALLOWED" : "BLOCKED",
  violations: result.violations
};
fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n");

// Output response - only if blocking/asking
if (!result.isValid) {
  const reason = `DANGEROUS COMMAND DETECTED\nViolations: ${result.violations.join(", ")}\nCommand: ${command}`;
  console.log(JSON.stringify({ decision: "ask", reason }));
}
// If valid, no output = allow by default

process.exit(0);
