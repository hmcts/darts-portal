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
  global.isTerminating = true;
  // small delay before closing the server
  // allowing the readiness check to fail and traffic to the pod
  if (NODE_ENV === 'production') {
    await new Promise((res) => setTimeout(res, 10000));
  }
  console.info('Server closing down');
  server.close(async () => {
    console.log('Server closing down completed');
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
