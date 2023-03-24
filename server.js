const express = require('express');
const path = require('path');
const healthCheck = require('@hmcts/nodejs-healthcheck');

const app = express();
const appHealth = express();
const port = 3000;

const healthConfig = {
  checks: {},
  buildInfo: {},
};

healthCheck.addTo(appHealth, healthConfig);

app.use(express.static(path.join(__dirname, 'dist/darts-portal')));

app.use(appHealth);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/darts-portal/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
