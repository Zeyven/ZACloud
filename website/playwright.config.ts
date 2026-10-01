import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.ZAI_TEST_PORT || 3000);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid test port");
const previewURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: 3,
  timeout: 45000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: previewURL, trace: "retain-on-failure" },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.CI
          ? {}
          : { executablePath: "/usr/bin/chromium" },
      },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ...(process.env.ZAI_EDGE_EXECUTABLE_PATH
      ? [
          {
            name: "edge",
            use: {
              ...devices["Desktop Edge"],
              launchOptions: {
                executablePath: process.env.ZAI_EDGE_EXECUTABLE_PATH,
              },
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: `pnpm start --port ${port}`,
    url: previewURL,
    reuseExistingServer: false,
    timeout: 60000,
  },
});
