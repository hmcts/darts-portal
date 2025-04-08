import { startServer } from './server';

import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);

const PORT = config.get('port');
const NODE_ENV = config.get('node-env');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const express = startServer();
const server = express.listen(PORT, () => {
  console.log(READY_MESSAGE);
});

async function stopServer() {
  console.info('Server shutdown signal received');
  console.info('Server closing down');
  server.close(async () => {
    console.log('Server closing down completed');
    if (NODE_ENV === 'production') {
      // 15s wait to match k8s liveness probe
      await new Promise((res) => setTimeout(res, 15000));
    }
    console.log('Process exiting');
    process.exit(0);
  });
}

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await stopServer();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await stopServer();
});
