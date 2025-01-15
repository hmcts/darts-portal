const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'functional-output/functional/test-output-[hash].xml',
  },
  e2e: {
    baseUrl: process.env.TEST_URL || 'http://localhost:3000',
    supportFile: false,
    pageLoadTimeout: 10000,
  },
  component: {
    supportFile: false,
  },
});
