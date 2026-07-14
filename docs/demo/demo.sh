#!/usr/bin/env bash
# Scripted demo for the README GIF — a faithful reconstruction of the real
# hook -> agent -> sniper cycle (no live LLM call). Rhythm is driven by sleeps
# so VHS captures a readable pace. See docs/demo/hook-sniper.tape.
set -u

# ── palette ──────────────────────────────────────────────────────────
DIM=$'\e[38;5;245m'; RED=$'\e[38;5;203m'; GRN=$'\e[38;5;114m'
YEL=$'\e[38;5;222m'; BLU=$'\e[38;5;110m'; MAG=$'\e[38;5;176m'
BOLD=$'\e[1m'; RST=$'\e[0m'

p()  { printf '%b\n' "$1"; }
pause() { sleep "${1:-0.6}"; }

# ── the run ──────────────────────────────────────────────────────────
pause 0.5
p "${DIM}› detecting project…${RST}  ${BLU}next.config.ts${RST} ${DIM}→ activating${RST} ${BOLD}nextjs-expert${RST}"
pause 1.0
p "${DIM}› task: add a slugify() helper for the blog routes${RST}"
pause 1.1

p ""
p "${YEL}✎ Write${RST} ${DIM}src/lib/slug.ts${RST}"
pause 0.9
p "${RED}${BOLD}⛔ DRY hook — Write blocked${RST}"
p "   ${RED}'slugify' already exists${RST} → ${BOLD}src/utils/str.ts:12${RST}"
p "   ${DIM}import it, don't duplicate.${RST}"
pause 1.4

p ""
p "${DIM}› complying with hook — import instead of duplicate${RST}"
pause 0.9
p "${GRN}✔ Edit${RST} ${DIM}src/app/blog/[slug]/page.tsx${RST}"
p "   ${MAG}import { slugify } from '@/utils/str'${RST}"
pause 1.2

p ""
p "${BLU}› sniper (eXamine)${RST} ${DIM}explore → research → grep usages → lint → fix${RST}"
pause 1.3
p "${GRN}${BOLD}✔ sniper PASS${RST}   ${DIM}lint${RST} 0 · ${DIM}types${RST} 0 · ${DIM}duplication${RST} 0"
pause 1.1

p ""
p "${DIM}────────────────────────────────────────────────────────${RST}"
p "${MAG}◆${RST} ${BOLD}opus-4.8${RST} ${DIM}·${RST} ${BLU}APEX:eXamine${RST} ${DIM}·${RST} ${GRN}sniper ✔${RST} ${DIM}·${RST} 0 dup ${DIM}·${RST} 87k/1m"
pause 1.6
