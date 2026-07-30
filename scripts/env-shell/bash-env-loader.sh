# Claude Code - BASH_ENV shim: load ~/.claude/.env, minus the FUSE_* keys.
# Install: copy to ~/.claude/bash-env-loader.sh (pointed at by BASH_ENV).
#
# SOURCED, never executed: no `exit`, exports land in the current shell.
# Reads the .env on every invocation, so a newly added API key is picked up
# with no resync. FUSE_* are per-harness (FUSE_HARNESS_REFS points at one
# harness' rules tree) and must NEVER leak into another agent's environment.

if [ -f "$HOME/.claude/.env" ]; then
    while IFS= read -r __fuse_line || [ -n "$__fuse_line" ]; do
        __fuse_line="${__fuse_line#"${__fuse_line%%[! 	]*}"}"
        case "$__fuse_line" in ''|'#'*) continue ;; esac
        case "$__fuse_line" in 'export '*) __fuse_line="${__fuse_line#export }" ;; esac
        case "$__fuse_line" in *=*) ;; *) continue ;; esac
        __fuse_key="${__fuse_line%%=*}"
        __fuse_val="${__fuse_line#*=}"
        case "$__fuse_key" in
            FUSE_*) continue ;;
            [!A-Za-z_]*|*[!A-Za-z0-9_]*) continue ;;
        esac
        case "$__fuse_val" in
            '"'*) __fuse_val="${__fuse_val#\"}"; __fuse_val="${__fuse_val%%\"*}" ;;
            "'"*) __fuse_val="${__fuse_val#\'}"; __fuse_val="${__fuse_val%%\'*}" ;;
            *)
                __fuse_val="${__fuse_val%% #*}"
                __fuse_val="${__fuse_val%%	#*}"
                __fuse_val="${__fuse_val%"${__fuse_val##*[! 	]}"}"
                ;;
        esac
        export "$__fuse_key=$__fuse_val"
    done < "$HOME/.claude/.env"
    unset __fuse_line __fuse_key __fuse_val
fi
