import { startServer } from './server';

import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);

const PORT = config.get('port');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const express = startServer();
const server = express.listen(PORT, () => {
  console.log(READY_MESSAGE);
});

async function stopServer() {
  console.info('Express server shutdown signal received');
  console.info('Express server closing down');
  server.close(() => {
    console.log('Express server closing down completed');
    process.exit(0);
  });
}

process.on('SIGINT', function () {
  stopServer();
});

process.on('SIGTERM', () => {
  stopServer();
});
