/**
 * API keys configuration for MCP servers
 */
import type { EnvKey } from "../interfaces/env";

export const API_KEYS: EnvKey[] = [
  // No API key required (free):
  // sequential-thinking, memory, filesystem, playwright, postgres, shadcn,
  // next-devtools, XcodeBuildMCP, apple-docs

  // API key required
  { name: "CONTEXT7_API_KEY", description: "Context7 - Documentation lookup", url: "https://context7.com" },
  { name: "EXA_API_KEY", description: "Exa - AI web search & research", url: "https://exa.ai" },
  { name: "MAGIC_API_KEY", description: "Magic 21st.dev - UI generation", url: "https://21st.dev" },
  { name: "GEMINI_DESIGN_API_KEY", description: "Gemini Design - AI frontend", url: "https://gemini-design-mcp.com" },
  { name: "GITHUB_TOKEN", description: "GitHub - repos, PRs, issues", url: "https://github.com/settings/tokens" },
  { name: "SUPABASE_ACCESS_TOKEN", description: "Supabase - database & auth", url: "https://supabase.com/dashboard/account/tokens" },
  { name: "SLACK_TOKEN", description: "Slack - messages & workspace", url: "https://api.slack.com/apps" },
  { name: "SENTRY_AUTH_TOKEN", description: "Sentry - error tracking", url: "https://sentry.io/settings/auth-tokens" },
  { name: "BRAVE_API_KEY", description: "Brave Search - private search", url: "https://brave.com/search/api" },
  { name: "STRIPE_SECRET_KEY", description: "Stripe - payments & billing", url: "https://dashboard.stripe.com/apikeys" },
  { name: "NOTION_TOKEN", description: "Notion - pages & databases", url: "https://www.notion.so/my-integrations" },
  { name: "REPLICATE_API_TOKEN", description: "Replicate - 1000+ AI models", url: "https://replicate.com/account/api-tokens" },
];
