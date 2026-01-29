/**
 * API keys configuration for MCP servers
 */
import type { EnvKey } from "../interfaces/env";

export const API_KEYS: EnvKey[] = [
  { name: "CONTEXT7_API_KEY", description: "Context7 - Documentation" },
  { name: "EXA_API_KEY", description: "Exa - Web search" },
  { name: "MAGIC_API_KEY", description: "Magic 21st.dev - UI" },
  { name: "GEMINI_DESIGN_API_KEY", description: "Gemini Design - AI frontend" },
];
