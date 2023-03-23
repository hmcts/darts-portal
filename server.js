const express = require('express');
const path = require('path');
const healthCheck = require('@hmcts/nodejs-healthcheck');
const Lame = require('node-lame').Lame;

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
/**
 * Start of routes for testing audio conversion
 */
app.get('/media/samples', (_, res) => {
  res.json(require(path.resolve('./audio-samples/samples.json')));
});

app.get('/media/samples/:fileName', async (req, res) => {
  console.log('media file path', path.join(__dirname, `./audio-samples/${req.params.fileName}`));
  const fileName = req.params.fileName;
  const fileNameMp3 = fileName.replace('.mp2', '.mp3');
  const encoder = new Lame({
    output: 'buffer',
    bitrate: 192,
  }).setFile(path.join(__dirname, `./audio-samples/${req.params.fileName}`));

  try {
    await encoder.encode();
    res.setHeader('Content-Disposition', `attachment; filename=${fileNameMp3}`);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(encoder.getBuffer());
  } catch (error) {
    console.error(`error encoding file ${fileName} to MP3`, error);
    res.status(500).send();
  }
});

app.get('/media/downloads/:fileName', (req, res) => {
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.fileName}`);
  res.setHeader('Content-Type', 'audio/mpeg');
  res.sendFile(path.resolve(`./audio-samples/${req.params.fileName}`));
});
/**
 * End of routes for testing audio conversion
 */

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/darts-portal/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
