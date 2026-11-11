import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 4321);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

const webServerEnv: Record<string, string> = {
  PORT: String(PORT),
  HOST: "127.0.0.1",
  INTERNAL_API_URL: process.env.INTERNAL_API_URL ?? "http://127.0.0.1:3002",
};
// Only override when the caller has it; otherwise --env-file-if-exists=.env
// supplies it (local runs).
if (process.env.GITHUB_TOKEN) {
  webServerEnv.GITHUB_TOKEN = process.env.GITHUB_TOKEN;
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  outputDir: "./e2e/test-results",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "off" : "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.CI ? { channel: "chrome" } : {}),
      },
    },
  ],
  webServer: {
    command: `node --env-file-if-exists=.env dist/server/entry.mjs`,
    url: `${baseURL}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: webServerEnv,
  },
});
