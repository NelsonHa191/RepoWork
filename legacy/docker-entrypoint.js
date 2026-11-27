#!/usr/bin/env node

const { spawn } = require("node:child_process");

const env = { ...process.env };

(async () => {
  // If running the web server then prerender pages
  if (process.argv.slice(-2).join(" ") === "npm start") {
    try {
      console.log("Running next build...");
      await exec("npx next build");
      console.log("Build completed successfully");
    } catch (error) {
      console.error("Build failed:", error.message);
    }
  }

  console.log(
    "Launching application with command:",
    process.argv.slice(2).join(" ")
  );

  // Launch application
  await exec(process.argv.slice(2).join(" "));
})();

function exec(command) {
  console.log(`Executing: ${command}`);
  const child = spawn(command, { shell: true, stdio: "inherit", env });
  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command '${command}' failed with exit code ${code}`));
      }
    });
  });
}
