const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.TEST_URL || 'http://localhost:4200',
    supportFile: false,
    pageLoadTimeout: 10000,
  },
  component: {
    supportFile: false,
  },
});
