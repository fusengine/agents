# VHS tape — README demo: the hook -> agent -> sniper cycle.
# Regenerate:  vhs docs/demo/hook-sniper.tape   (run from repo root)
# Output:      docs/img/demo.gif

Output docs/img/demo.gif

Require bash

Set Shell bash
Set FontSize 20
Set Width 1080
Set Height 640
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms
Set PlaybackSpeed 1.0

# ── setup (hidden): clean prompt + a `claude` shim that runs the scripted demo ──
Hide
Type `export PS1="\[\e[38;5;176m\]$ \[\e[0m\]"`
Enter
Type `claude() { bash docs/demo/demo.sh "$@"; }`
Enter
Type "clear"
Enter
Show

# ── the shot ──
Sleep 800ms
Type `claude "add a slugify helper"`
Sleep 600ms
Enter

# demo.sh drives its own pacing (~13s)
Sleep 14s
Sleep 1200ms
