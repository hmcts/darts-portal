const path = require('path');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.disable('x-powered-by');

app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

// specify this if you want to overwrite the entire DARTS API URL to proxy to
const proxyToApi = process.env.PROXY_TO_API_URL;
const port = 4545;
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
app.use('/userstate', require('./authentication/userstate'));
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
app.use('/transcriptions', require('./transcriptions/transcriptions').router);
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
app.use('/admin/retention-policy-types', require('./admin/retention-policies/retention-policies'));
app.use('/admin/transcriptions', require('./admin/transcriptions/transcriptions'));
app.use('/admin/transcription-status', require('./admin/transcriptions/transcription-status').router);
app.use('/admin/transcription-workflows', require('./admin/transcriptions/transcription-workflows'));
app.use('/admin/transcription-documents', require('./admin/transcriptions/transcription-documents'));
app.use('/admin/automated-tasks', require('./admin/automated-tasks/automated-tasks'));
app.use('/admin/event-mappings', require('./admin/event-mappings/event-mappings'));
app.use('/admin/event-handlers', require('./admin/event-mappings/event-handlers'));
app.use('/admin/transformed-medias', require('./admin/transformed-media/transformed-media'));
app.use('/admin/medias', require('./admin/medias/medias'));
app.use('/admin/media-requests', require('./admin/media-requests/media-requests'));
app.use('/admin/hidden-reasons', require('./admin//transcriptions/hidden-reasons'));
app.use('/admin/cases', require('./admin/cases/cases'));
app.use('/admin/events', require('./admin/events/events'));
app.use('/admin/hearings', require('./admin/hearings/hearings'));
app.use('/admin/node-register-management', require('./admin/node-registrations/node-registrations'));

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
