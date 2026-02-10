/**
 * APEX task.json manipulation helpers.
 * Provides create/start/complete operations on task.json entries.
 */
import { readJsonFile, writeJsonFile } from "../core";
import type { ApexTaskFile } from "../interfaces/apex.interface";

/** Add a new task to task.json */
export async function taskCreate(
  file: string, id: string, subject: string, desc: string,
): Promise<void> {
  const data = await readJsonFile<ApexTaskFile>(file);
  if (!data) return;
  data.tasks[id] = {
    subject, description: desc, status: "pending", phase: "pending",
    created_at: new Date().toISOString(), doc_consulted: {}, files_modified: [], blockedBy: [],
  };
  await writeJsonFile(file, data);
}

/** Mark a task as in_progress in task.json */
export async function taskStart(
  file: string, id: string, subject?: string, desc?: string, blocked?: string,
): Promise<void> {
  const data = await readJsonFile<ApexTaskFile>(file);
  if (!data) return;
  if (!data.tasks[id]) {
    data.tasks[id] = {
      subject: "", description: "", status: "in_progress", phase: "analyze",
      doc_consulted: {}, files_modified: [],
    };
  }
  data.current_task = id;
  Object.assign(data.tasks[id], {
    status: "in_progress", phase: "analyze", started_at: new Date().toISOString(),
  });
  if (subject) data.tasks[id].subject = subject;
  if (desc) data.tasks[id].description = desc;
  if (blocked) data.tasks[id].blockedBy = blocked.split(",");
  await writeJsonFile(file, data);
}

/** Mark a task as completed in task.json */
export async function taskComplete(file: string, id: string): Promise<void> {
  const data = await readJsonFile<ApexTaskFile>(file);
  if (!data?.tasks[id]) return;
  Object.assign(data.tasks[id], {
    status: "completed", phase: "completed", completed_at: new Date().toISOString(),
  });
  await writeJsonFile(file, data);
}
