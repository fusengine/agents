#!/bin/bash
# apex-task-helpers.sh - APEX task.json manipulation helpers
set -euo pipefail

# @description Handle TaskCreate - add new task to task.json
# @param $1 Task file path  @param $2 Task ID  @param $3 Subject  @param $4 Description
apex_task_create() {
  local task_file="$1" task_id="$2" subject="$3" desc="$4"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  jq --arg task "$task_id" --arg time "$timestamp" \
     --arg subject "$subject" --arg desc "$desc" '
    .tasks[$task] = {
      "subject": $subject, "description": $desc, "status": "pending",
      "phase": "pending", "created_at": $time, "doc_consulted": {},
      "files_modified": [], "blockedBy": []
    }
  ' "$task_file" > "${task_file}.tmp" && mv "${task_file}.tmp" "$task_file"
}

# @description Handle TaskUpdate status=in_progress
# @param $1 Task file  @param $2 Task ID  @param $3 Subject  @param $4 Description  @param $5 BlockedBy
apex_task_start() {
  local task_file="$1" task_id="$2" subject="$3" desc="$4" blocked="${5:-}"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  jq --arg task "$task_id" --arg time "$timestamp" \
     --arg subject "$subject" --arg desc "$desc" --arg blocked "$blocked" '
    .current_task = $task |
    .tasks[$task] //= {"subject":"","description":"","status":"in_progress","phase":"analyze","doc_consulted":{},"files_modified":[],"blockedBy":[]} |
    .tasks[$task].status = "in_progress" | .tasks[$task].phase = "analyze" | .tasks[$task].started_at = $time |
    (if $subject != "" then .tasks[$task].subject = $subject else . end) |
    (if $desc != "" then .tasks[$task].description = $desc else . end) |
    (if $blocked != "" then .tasks[$task].blockedBy = ($blocked | split(",")) else . end)
  ' "$task_file" > "${task_file}.tmp" && mv "${task_file}.tmp" "$task_file"
}

# @description Handle TaskUpdate status=completed
# @param $1 Task file  @param $2 Task ID
apex_task_complete() {
  local task_file="$1" task_id="$2"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  jq --arg task "$task_id" --arg time "$timestamp" '
    .tasks[$task].status = "completed" | .tasks[$task].phase = "completed" | .tasks[$task].completed_at = $time
  ' "$task_file" > "${task_file}.tmp" && mv "${task_file}.tmp" "$task_file"
}

# @description Update doc_consulted in task.json
# @param $1 Task file  @param $2 Task ID  @param $3 Framework  @param $4 Source  @param $5 Doc file
apex_task_doc_consulted() {
  local task_file="$1" task_id="$2" fw="$3" source="$4" doc_file="$5"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  jq --arg task "$task_id" --arg fw "$fw" --arg file "$doc_file" \
     --arg source "$source" --arg time "$timestamp" '
    .tasks[$task] //= {} | .tasks[$task].doc_consulted //= {} |
    .tasks[$task].doc_consulted[$fw] = {"consulted":true,"file":$file,"source":$source,"timestamp":$time}
  ' "$task_file" > "${task_file}.tmp" && mv "${task_file}.tmp" "$task_file"
}

export -f apex_task_create apex_task_start apex_task_complete apex_task_doc_consulted
