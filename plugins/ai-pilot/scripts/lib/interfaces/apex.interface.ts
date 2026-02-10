/**
 * APEX methodology interfaces for task tracking and state management.
 */

/** APEX task entry in task.json */
export interface ApexTask {
  subject: string;
  description: string;
  status: string;
  phase: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  doc_consulted: Record<string, unknown>;
  files_modified: string[];
  blockedBy?: string[];
}

/** Structure of .claude/apex/task.json */
export interface ApexTaskFile {
  current_task: string;
  created_at: string;
  tasks: Record<string, ApexTask>;
}
