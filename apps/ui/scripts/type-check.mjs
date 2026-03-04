import { execSync } from "child_process";

try {
  const result = execSync("npx tsc --noEmit --pretty false 2>&1", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10,
    timeout: 120000,
  });
  console.log("NO TYPE ERRORS FOUND");
  console.log(result);
} catch (e) {
  const output = e.stdout || e.stderr || e.message;
  // Filter to only "Object literal" and "does not exist" and "not assignable" errors
  const lines = output.split("\n");
  const errors = lines.filter(l => 
    l.includes("error TS") || 
    l.includes("Object literal") || 
    l.includes("does not exist") ||
    l.includes("not assignable") ||
    l.includes("Property") ||
    l.includes("missing in type")
  );
  console.log(`TOTAL ERRORS IN OUTPUT: ${lines.filter(l => l.includes("error TS")).length}`);
  console.log("---FILTERED TYPE ERRORS---");
  // Print unique errors (deduplicated by file+line)
  const seen = new Set();
  for (const err of errors) {
    const key = err.substring(0, 80);
    if (!seen.has(key)) {
      seen.add(key);
      console.log(err);
    }
  }
}
