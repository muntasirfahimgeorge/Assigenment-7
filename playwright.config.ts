import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const baseURL = "http://localhost:3002";
const windowsChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (process.platform === "win32" && existsSync(windowsChrome)
    ? windowsChrome
    : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  expect: { timeout: 15000 },
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: { executablePath },
    trace: "off",
    screenshot: "off",
  },
  webServer: {
    command: "npm run start -- --port 3002",
    url: `${baseURL}/signin`,
    reuseExistingServer: false,
    env: { BETTER_AUTH_URL: baseURL },
    timeout: 60000,
  },
});
