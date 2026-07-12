import { test, expect } from "bun:test";
import { bashWriteGuard, type GuardContext } from "../src/policy/guards/bash-write";

test("blocks sed -i on a code file (fires)", () => {
  const ctx: GuardContext = {
    tool: "Bash",
    command: "sed -i 's/foo/bar/' src/index.ts",
  };
  const out = bashWriteGuard(ctx);
  expect(out).not.toBeNull();
  expect(out?.kind).toBe("block");
  expect(out?.actions).toEqual(["Use the Write/Edit tool instead"]);
});

test("blocks redirect to a code-file extension (fires)", () => {
  const out = bashWriteGuard({ tool: "Bash", command: "echo x > app.tsx" });
  expect(out?.kind).toBe("block");
});

test("blocks python3 -c inline script (fires)", () => {
  const out = bashWriteGuard({ tool: "Bash", command: "python3 -c 'print(1)'" });
  expect(out?.kind).toBe("block");
});

test("asks before redirect to a non-code file (fires)", () => {
  const out = bashWriteGuard({ tool: "Bash", command: "echo log >> out.txt" });
  expect(out?.kind).toBe("ask");
});

test("passes a plain read command (null)", () => {
  const out = bashWriteGuard({ tool: "Bash", command: "ls -la src" });
  expect(out).toBeNull();
});

test("passes when tool is not Bash (null)", () => {
  const out = bashWriteGuard({ tool: "Write", command: "sed -i x a.ts" });
  expect(out).toBeNull();
});
