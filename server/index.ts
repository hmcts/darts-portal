import { startServer } from './server';

import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);
import * as GracefulShutdownManager from '@moebius/http-graceful-shutdown';

const PORT = config.get('port');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const express = startServer();
const server = express.listen(PORT, () => {
  console.log(READY_MESSAGE);
});

const shutdownManager = new GracefulShutdownManager.GracefulShutdownManager(server);

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server is gracefully terminated');
  });
});
