---
description: Create or restructure skills following standard patterns. Generates SKILL.md + references/ structure with Agent Workflow, proper frontmatter, and documentation conventions.
argument-hint: "<skill-name> [--from <source-skill>] [--adapt <next→react>]"
---

# Skill Creator

Create or restructure skills following established patterns and conventions.

---

## CRITICAL: Language Requirement (MANDATORY)

**ALL skill content MUST be written in English only.**

This applies to:
- SKILL.md (frontmatter, sections, descriptions)
- All reference files (references/*.md)
- All template files (references/templates/*.md)
- Code comments
- Documentation text
- Examples and explanations

**NEVER write skill content in French or any other language.**

The only exception is user-facing UI strings in code examples (if the target app requires localization).

---

## Skill Creator Workflow (MANDATORY)

**Before creating or improving ANY skill, ALWAYS launch in parallel:**

### Phase 1: Analyze (3 agents in parallel)

```
1. fuse-ai-pilot:explore-codebase
   - Check if skill already exists in plugins/
   - Analyze existing skill structure if present
   - Identify similar skills to use as reference

2. fuse-ai-pilot:research-expert
   - Search latest official documentation online
   - Get current stable version number
   - Identify key features and patterns

3. mcp__context7__query-docs OR mcp__exa__web_search_exa
   - Fetch real documentation from official sources
   - Get code examples from official docs
   - Verify best practices and patterns
```

### Phase 2: Plan

Based on research results:
- List all topics to cover (installation, core concepts, patterns, etc.)
- Identify reference files needed
- Identify template files needed (complete code examples)
- Estimate file count and structure

### Phase 3: Execute

- Create SKILL.md with descriptive content
- Create reference files (conceptual documentation)
- Create templates (complete, copy-paste ready code)
- Link references to templates throughout

### Phase 4: Validate

Run **fuse-ai-pilot:sniper** to verify:
- All files exist and have proper frontmatter
- No broken links
- All references listed in SKILL.md frontmatter
- Templates contain complete, working code

---

## Example Workflow

```bash
# User request: Improve skill react-tanstack-router

# Phase 1: Analyze (parallel)
→ explore-codebase: Found existing skill with only SKILL.md (241 lines)
→ research-expert: TanStack Router v1.131.2, file-based routing, type-safe
→ context7/exa: Fetched official docs, API reference, patterns

# Phase 2: Plan
→ Need 18 reference files + 5 templates
→ Topics: installation, routing, params, loaders, auth, query integration...

# Phase 3: Execute
→ Created 23 files (8,406 lines of documentation)
→ All references link to relevant templates

# Phase 4: Validate
→ sniper: All files valid, no broken links, frontmatter complete
```

---

## Skill Architecture

```
skills/<skill-name>/
├── SKILL.md                    # Main entry point (descriptive, guides agent)
└── references/                 # All documentation and code examples
    ├── installation.md         # Conceptual: setup, configuration
    ├── patterns.md             # Conceptual: core patterns
    ├── ...                     # Other conceptual references
    └── templates/              # Full code examples (MANDATORY for complete skills)
        ├── basic-setup.md      # Complete project setup
        ├── feature-module.md   # Feature module example
        └── ...                 # Other complete templates
```

**Key principle:**
- `references/*.md` = Conceptual documentation (WHY + minimal code snippets)
- `references/templates/*.md` = Complete code examples (copy-paste ready)

---

## SKILL.md Structure

### Frontmatter (YAML)

```yaml
---
name: skill-name
description: Short description for skill detection. Use when [trigger conditions].
versions:
  library: X.Y.Z
  react: 19
user-invocable: true|false
references: references/file1.md, references/file2.md, ...
related-skills: skill-a, skill-b
---
```

### Agent Workflow (MANDATORY)

```markdown
## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing [domain] patterns
2. **fuse-ai-pilot:research-expert** - Verify latest [library] docs via Context7/Exa
3. **mcp__context7__query-docs** - Check [specific] patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.
```

### Required Sections

1. **Overview** - When to use, Why this library, comparison table
2. **Critical Rules** - Non-negotiable patterns (numbered list)
3. **Architecture** - SOLID module structure with link to template
4. **Reference Guide** - Two tables:
   - **Concepts** (references/*.md) - Explanatory documentation
   - **Templates** (references/templates/*.md) - Complete code examples
5. **Core Patterns** - Key patterns with links to templates
6. **Best Practices** - Do's and Don'ts with code snippets

### SKILL.md Guidelines

- **Be descriptive** - Guide the agent to the right reference/template
- **Link to templates** - Each concept should point to a template for implementation
- **Use tables** - Organize references by topic and priority
- **Include "See [template.md]"** - After each pattern, link to the complete example

---

## Reference File Structure

### Frontmatter

```yaml
---
name: reference-name
description: What this reference covers
when-to-use: Trigger conditions for this reference
keywords: keyword1, keyword2, keyword3
priority: high|medium|low
requires: other-reference.md
related: related1.md, related2.md
---
```

### Content Rules

- **Conceptual first** - Explain WHY, not just HOW
- **Code in references/templates/** - References have minimal inline code, templates have complete examples
- **Max 150 lines** - Split large topics
- **Links to templates** - Each reference should link to relevant templates for implementation
- **Cross-reference** - Link to related references and templates

### Template File Structure

```yaml
---
name: template-name
description: Complete example of [what this template demonstrates]
keywords: keyword1, keyword2, keyword3
---
```

Templates should include:
- Complete file structure
- All necessary interfaces/types
- Full implementation code
- Ready to copy-paste

---

## Creation Workflow

### Option 1: New Skill (From Online Documentation)

**Step 1: Research (MANDATORY)**
```bash
# Launch research-expert to fetch latest documentation
→ research-expert: "Research complete documentation for [library-name]"

# Use Context7 or Exa to get official docs
→ mcp__context7__resolve-library-id: Find library ID
→ mcp__context7__query-docs: Fetch specific topics
→ mcp__exa__web_search_exa: Search for latest patterns/tutorials
```

**Step 2: Create Structure**
```bash
mkdir -p plugins/<agent>/skills/<skill-name>/references/templates
```

**Step 3: Transcribe Documentation**
- SKILL.md: Overview, critical rules, architecture, reference guide
- references/*.md: Conceptual documentation from official docs
- references/templates/*.md: Complete code examples from official docs

**Step 4: Validate**
```bash
# Run sniper to validate
→ sniper: Validate all files, links, frontmatter
```

### Option 2: Improve Existing Skill

**Step 1: Analyze**
```bash
# Explore existing skill structure
→ explore-codebase: Analyze plugins/<agent>/skills/<skill-name>/
```

**Step 2: Research Updates**
```bash
# Fetch latest documentation
→ research-expert: "Get latest [library] documentation for 2026"
→ context7/exa: Fetch new features, patterns, best practices
```

**Step 3: Update**
- Add missing reference files
- Add missing templates
- Update version numbers
- Add new patterns/features

### Option 3: Copy & Adapt

```bash
# 1. Find similar skill
ls plugins/<agent>/skills/

# 2. Copy references
cp -r plugins/<source>/skills/<similar>/references/ \
      plugins/<target>/skills/<new-skill>/references/

# 3. Adapt with sed
for file in references/*.md; do
  sed -i '' "s/Next\.js/React/g; s/'use client'//g" "$file"
done

# 4. Remove non-applicable files
rm references/hydration.md  # If no SSR

# 5. Research to fill gaps
→ research-expert: Get missing documentation

# 6. Validate
→ sniper: Validate all files
```

---

## Adaptation Patterns

### Next.js → React

```bash
sed -i '' "s/Next\.js 16/React/g" *.md
sed -i '' "s/Next\.js App Router/React applications/g" *.md
sed -i '' "s/Next\.js/React/g" *.md
sed -i '' "s/'use client'//g" *.md
# Remove: hydration.md, nextjs-integration.md, server-actions.md
```

### Next.js → Laravel

```bash
# Different approach - usually create from scratch
# or adapt from laravel-expert existing skills
```

---

## Validation Checklist

- [ ] **ALL content in English** (CRITICAL - no French or other languages)
- [ ] SKILL.md has proper frontmatter with all references listed
- [ ] SKILL.md is descriptive and guides agent to correct references/templates
- [ ] Agent Workflow section present
- [ ] Reference Guide has two tables: Concepts + Templates
- [ ] Each concept links to relevant template ("See [template.md]")
- [ ] Templates in `references/templates/` folder
- [ ] Templates have complete, copy-paste ready code
- [ ] Keywords in each reference/template frontmatter
- [ ] related-skills points to valid skills
- [ ] No Next.js references in React skills
- [ ] No 'use client' in React SPA skills

---

## Examples

### Create Zustand skill for React

```
/skill-creator react-state --from nextjs-zustand --adapt next→react
```

**Result**:
1. Copy 12 references from nextjs-zustand
2. Adapt: Remove SSR (hydration, nextjs-integration)
3. Adapt: Remove 'use client' directives
4. Update SKILL.md with React context

### Create new skill from scratch

```
/skill-creator react-animations
```

**Result**:
1. Create empty structure
2. Generate SKILL.md template
3. Suggest reference files based on topic

---

## Register Skill to Agent (MANDATORY)

After creating a skill, you MUST register it in two places:

### 1. Agent Frontmatter

```yaml
# plugins/<plugin>/agents/<agent>.md
---
name: agent-name
skills: existing-skill-a, existing-skill-b, NEW-SKILL-NAME
---
```

### 2. Marketplace.json

```json
// .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "fuse-<plugin>",
      "skills": [
        "./skills/existing-skill-a",
        "./skills/existing-skill-b",
        "./skills/NEW-SKILL-NAME"
      ]
    }
  ]
}
```

### Registration Checklist

- [ ] Add skill name to agent's `skills:` list in frontmatter
- [ ] Add skill path to plugin's `skills:` array in marketplace.json
- [ ] Verify skill name matches folder name exactly
- [ ] Check related-skills in SKILL.md point to valid registered skills

---

## Commit Convention

```
docs(<skill-name>): create/restructure skill with X reference files

- List main reference files added
- Note any files adapted from source
- Note any SSR/framework-specific removals
- Register in agent and marketplace.json
```
