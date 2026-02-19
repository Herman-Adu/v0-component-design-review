import { execSync } from "child_process";

try {
  const output = execSync("pnpm run build", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    stdio: "pipe",
    timeout: 120000,
  });
  const lines = output.split("\n");
  console.log(lines.slice(-30).join("\n"));
  console.log("\n=== BUILD PASSED ===");
} catch (err) {
  const stderr = err.stderr || "";
  const stdout = err.stdout || "";
  const combined = stdout + "\n" + stderr;
  const lines = combined.split("\n");
  console.log(lines.slice(-40).join("\n"));
  console.log("\n=== BUILD FAILED ===");
  process.exit(1);
}
