import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "tests/cypress/support/e2e.ts",
    specPattern:
      "tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    fixturesFolder: "tests/cypress/fixtures",
    screenshotsFolder: "tests/cypress/screenshots",
    videosFolder: "tests/cypress/videos",
    downloadsFolder: "tests/cypress/downloads",
  },
});
