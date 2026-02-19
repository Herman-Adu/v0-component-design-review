import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

try {
  console.log("Starting production build validation...");
  console.log("Project root:", projectRoot);
  const output = execSync("npx next build", {
    encoding: "utf-8",
    cwd: projectRoot,
    timeout: 180000,
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
