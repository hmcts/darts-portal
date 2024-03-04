const path = require('path');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// specify this if you want to overwrite the entire DARTS API URL to proxy to
const proxyToApi = process.env.PROXY_TO_API_URL;
const port = 4551;
const defaultApiPort = 4550;

app.set('view engine', 'ejs');
app.set('views', 'darts-api-stub/views');
app.use('/assets', express.static(path.join(__dirname, '../server/assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (_, res) => res.send('Welcome to the DARTS API stub'));

// stub out user authentication
app.use('/external-user', require('./authentication'));
app.use('/internal-user', require('./authentication'));
// stub out courthouses api
app.use('/courthouses', require('./courthouses/courthouses'));
// retention APIs
app.use('/retentions', require('./retentions/retention'));
// stub out certain case APIs
app.use('/cases', require('./cases/case'));
// audio request API
app.use('/audio-requests', require('./audios/audio-requests'));
// hearing APIs
app.use('/hearings', require('./hearings/hearings'));
// transcription APIs
app.use('/transcriptions', require('./transcriptions/transcriptions'));
// audio APIs
app.use('/audio', require('./audios'));
// annotation APIs
app.use('/annotations', require('./annotations/annotations'));
// ADMIN APIs
app.use('/admin/users', require('./admin/users/users'));
app.use('/admin/courthouses', require('./admin/courthouses/courthouses'));
app.use('/admin/regions', require('./admin/regions/regions'));
app.use('/admin/security-groups', require('./admin/security-groups/security-groups').router);
app.use('/admin/security-roles', require('./admin/security-roles/security-roles'));

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
