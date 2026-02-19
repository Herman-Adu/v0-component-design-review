import { execSync } from "child_process";

try {
  console.log("Starting production build validation...");
  const output = execSync("cd /vercel/share/v0-project && npx next build", {
    encoding: "utf-8",
    timeout: 120000,
    env: { ...process.env, NODE_ENV: "production" },
  });
  console.log(output);
  console.log("BUILD PASSED");
} catch (error) {
  console.error("BUILD FAILED");
  console.error(error.stdout || "");
  console.error(error.stderr || "");
  process.exit(1);
}
