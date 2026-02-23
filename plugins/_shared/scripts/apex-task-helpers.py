#!/usr/bin/env python3
"""apex-task-helpers.py - APEX task.json manipulation helpers.

Importable functions for task state management (no main).
"""

import json
import os
from datetime import datetime, timezone


def _utc_now() -> str:
    """Return current UTC timestamp in ISO format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _atomic_write(task_file: str, data: dict) -> None:
    """Write JSON data atomically via tmp file."""
    tmp = task_file + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, task_file)


def apex_task_create(task_file: str, task_id: str, subject: str, desc: str) -> None:
    """Add a new task to task.json."""
    with open(task_file, encoding="utf-8") as f:
        data = json.load(f)
    data.setdefault("tasks", {})[task_id] = {
        "subject": subject, "description": desc, "status": "pending",
        "phase": "pending", "created_at": _utc_now(),
        "doc_consulted": {}, "files_modified": [], "blockedBy": [],
    }
    _atomic_write(task_file, data)


def apex_task_start(task_file: str, task_id: str, subject: str = "",
                    desc: str = "", blocked: str = "") -> None:
    """Set task status to in_progress."""
    with open(task_file, encoding="utf-8") as f:
        data = json.load(f)
    data["current_task"] = task_id
    default = {
        "subject": "", "description": "", "status": "in_progress",
        "phase": "analyze", "doc_consulted": {}, "files_modified": [],
        "blockedBy": [],
    }
    task = data.setdefault("tasks", {}).setdefault(task_id, default)
    task["status"] = "in_progress"
    task["phase"] = "analyze"
    task["started_at"] = _utc_now()
    if subject:
        task["subject"] = subject
    if desc:
        task["description"] = desc
    if blocked:
        task["blockedBy"] = blocked.split(",")
    _atomic_write(task_file, data)


def apex_task_complete(task_file: str, task_id: str) -> None:
    """Set task status to completed."""
    with open(task_file, encoding="utf-8") as f:
        data = json.load(f)
    task = data.get("tasks", {}).get(task_id, {})
    task["status"] = "completed"
    task["phase"] = "completed"
    task["completed_at"] = _utc_now()
    _atomic_write(task_file, data)


def apex_task_doc_consulted(task_file: str, task_id: str, fw: str,
                            source: str, doc_file: str) -> None:
    """Update doc_consulted in task.json."""
    with open(task_file, encoding="utf-8") as f:
        data = json.load(f)
    task = data.setdefault("tasks", {}).setdefault(task_id, {})
    docs = task.setdefault("doc_consulted", {})
    docs[fw] = {
        "consulted": True, "file": doc_file,
        "source": source, "timestamp": _utc_now(),
    }
    _atomic_write(task_file, data)
