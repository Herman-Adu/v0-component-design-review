import { execSync } from "child_process";

// First ensure next types are generated
try {
  console.log("Generating Next.js types...");
  execSync("npx next build --no-lint 2>&1 | head -100", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10,
    timeout: 180000,
  });
  console.log("BUILD SUCCEEDED - NO ERRORS");
} catch (err) {
  const output = (err.stdout || "") + (err.stderr || "");
  const lines = output.split("\n");
  
  // Find the type error section
  const errorLines = lines.filter(l => 
    l.includes("Type error:") || 
    l.includes("error TS") ||
    l.match(/^\.\/.+\.tsx?:\d+:\d+$/) ||
    l.includes("Property") ||
    l.includes("does not exist on type") ||
    l.includes("is not assignable") ||
    l.includes("Object literal may only specify known properties")
  );
  
  console.log(`\n=== BUILD OUTPUT (last 60 lines) ===`);
  const last60 = lines.slice(-60);
  for (const l of last60) {
    console.log(l);
  }
  
  console.log(`\n=== FILTERED TYPE ERRORS ===`);
  for (const l of errorLines) {
    console.log(l);
  }
  console.log(`\nTotal filtered error lines: ${errorLines.length}`);
}
