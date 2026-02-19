import { execSync } from "child_process";

try {
  const output = execSync("npx tsc --noEmit --pretty false 2>&1", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 10,
    timeout: 120000,
  });
  console.log("NO TYPE ERRORS FOUND");
  console.log(output || "(clean)");
} catch (err) {
  const stdout = err.stdout || "";
  const lines = stdout.split("\n").filter(l => l.includes("error TS"));
  console.log(`TOTAL ERRORS: ${lines.length}`);
  console.log("---");
  // Group by file
  const byFile = {};
  for (const line of lines) {
    const match = line.match(/^([^(]+)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
    if (match) {
      const [, file, row, col, code, msg] = match;
      const short = file.replace("/vercel/share/v0-project/", "");
      if (!byFile[short]) byFile[short] = [];
      byFile[short].push({ row, col, code, msg });
    }
  }
  for (const [file, errors] of Object.entries(byFile)) {
    console.log(`\nFILE: ${file} (${errors.length} errors)`);
    for (const e of errors) {
      console.log(`  L${e.row}:${e.col} [${e.code}] ${e.msg}`);
    }
  }
}
