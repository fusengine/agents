# MCP Servers

27 Model Context Protocol servers available for global installation.

## Installation

During setup, select MCP servers to install globally:

```
◆  Select MCP servers to install globally:
│  ◻ sequential-thinking  Dynamic problem-solving with step-by-step reasoning
│  ◻ memory               Knowledge graph-based persistent memory system
│  ◻ context7 [✓]         Up-to-date documentation for any library
│  ◻ exa [⚠ key missing]  Advanced AI-powered web search and research
```

Servers with `[✓]` have API keys configured. Servers with `[⚠ key missing]` require an API key.

## No API Key Required

| Server | Description |
|--------|-------------|
| sequential-thinking | Dynamic problem-solving with step-by-step reasoning |
| memory | Knowledge graph-based persistent memory system |
| filesystem | Secure local file operations with configurable access |
| git | Read, search and manipulate local Git repositories |
| fetch | Web content fetching and conversion for LLMs |
| time | Time and timezone conversion capabilities |
| playwright | Browser automation, E2E testing and screenshots |
| puppeteer | Headless Chrome automation and web scraping |
| postgres | PostgreSQL database operations and queries |
| sqlite | SQLite database for local data persistence |
| docker | Docker container management and operations |

## API Key Required

| Server | Description | Env Variable |
|--------|-------------|--------------|
| context7 | Up-to-date documentation for any library | `CONTEXT7_API_KEY` |
| exa | Advanced AI-powered web search and research | `EXA_API_KEY` |
| magic | AI-powered UI component generation (21st.dev) | `MAGIC_API_KEY` |
| gemini-design | Google Gemini for frontend generation | `GEMINI_DESIGN_API_KEY` |
| shadcn | shadcn/ui component registry | - |
| next-devtools | Next.js development tools and debugging | - |
| XcodeBuildMCP | Xcode build, run and test automation | - |
| apple-docs | Apple developer documentation and WWDC | - |
| github | GitHub repository operations | `GITHUB_TOKEN` |
| brave-search | Privacy-focused web search engine | `BRAVE_API_KEY` |
| supabase | Supabase backend-as-a-service | `SUPABASE_ACCESS_TOKEN` |
| notion | Notion workspace and page management | `NOTION_TOKEN` |
| slack | Slack workspace messaging | `SLACK_TOKEN` |
| stripe | Stripe payment processing | `STRIPE_SECRET_KEY` |
| sentry | Sentry error tracking and monitoring | `SENTRY_AUTH_TOKEN` |
| replicate | Replicate AI model hosting | `REPLICATE_API_TOKEN` |

## API Key URLs

| Service | Get API Key |
|---------|-------------|
| Context7 | https://context7.com |
| Exa | https://exa.ai |
| Magic | https://21st.dev |
| Gemini Design | https://ai.google.dev |
| GitHub | https://github.com/settings/tokens |
| Brave | https://brave.com/search/api |
| Supabase | https://supabase.com/dashboard |
| Notion | https://developers.notion.com |
| Slack | https://api.slack.com/apps |
| Stripe | https://dashboard.stripe.com/apikeys |
| Sentry | https://sentry.io/settings/account/api/auth-tokens |
| Replicate | https://replicate.com/account/api-tokens |

## Configuration

API keys are stored in `~/.claude/.env`:

```bash
# Core (used by plugins)
export CONTEXT7_API_KEY="ctx7sk-xxx"
export EXA_API_KEY="xxx"
export MAGIC_API_KEY="xxx"
export GEMINI_DESIGN_API_KEY="xxx"

# Optional
export GITHUB_TOKEN="ghp_xxx"
export BRAVE_API_KEY="xxx"
export SUPABASE_ACCESS_TOKEN="xxx"
export NOTION_TOKEN="xxx"
export SLACK_TOKEN="xoxb-xxx"
export STRIPE_SECRET_KEY="sk_xxx"
export SENTRY_AUTH_TOKEN="xxx"
export REPLICATE_API_TOKEN="xxx"
```

## Manual Installation

Install a specific MCP server manually:

```bash
claude mcp add-json --scope=user sequential-thinking '{"command":"npx","args":["-y","@modelcontextprotocol/server-sequential-thinking"],"type":"stdio"}'
```

List installed MCP servers:

```bash
claude mcp list
```

Remove an MCP server:

```bash
claude mcp remove sequential-thinking
```
