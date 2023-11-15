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

app.get('/', (req, res) => res.send('Welcome to the DARTS API stub'));

// stub out external user authentication
app.use('/external-user', require('./authentication/external'));
// stub out internal user authentication
app.use('/internal-user', require('./authentication/internal'));
// stub out courthouses api
app.use('/courthouses', require('./courthouses/courthouses'));
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
