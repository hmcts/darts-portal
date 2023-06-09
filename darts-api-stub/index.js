const express = require('express');
const config = require('config');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// specify this if you want to overwrite the entire DARTS API URL to proxy to
const proxyToApi = process.env.PROXY_TO_API_URL;
const port = 4551;
const defaultApiPort = 4550;

app.set('view engine', 'ejs');
app.set('views', 'darts-api-stub/views');

// stub out external user authentication
app.use('/external-user', require('./authentication/external'));
// proxy non-stubbed routes to the actual API
app.use(
  createProxyMiddleware({
    target: proxyToApi || config.get('darts-api.url').replace(port, defaultApiPort),
    changeOrigin: true,
    logLevel: 'debug',
  })
);

app.listen(port, () => {
  console.log(`DARTS API stub listening on port ${port}`);
});
