const { defineConfig } = require("@playwright/test");
require("dotenv").config();

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: "https://www.demoblaze.com/",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure"
  },

  reporter: [
    ["html"],
    ["allure-playwright"]
  ]
});