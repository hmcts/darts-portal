import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
propertiesVolume.addTo(config);

import { flushNow, initAppInsights, trackException } from './app-insights';
const aiOn = initAppInsights('DARTS Portal API');

import { startServer } from './server';

import * as appInsights from 'applicationinsights';
const PORT = config.get('port');
const NODE_ENV = config.get('node-env');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const express = startServer();
const server = express.listen(PORT, () => {
  console.log(READY_MESSAGE);
});

server.on('error', (err) => {
  if (aiOn) {
    trackException(err as Error, { stage: 'listen', port: String(PORT) });
    flushNow(() => process.exit(1));
  } else {
    console.error('listen error', err);
    process.exit(1);
  }
});

async function stopServer() {
  console.info('Server shutdown signal received');
  global.isTerminating = true;

  // give app insights a moment to send what’s buffered
  await new Promise<void>((resolve) => {
    appInsights.defaultClient?.flush();
    // small guard if flush never calls back:
    setTimeout(resolve, 1500);
  });

  // small delay before closing the server
  // allowing the readiness check to fail and traffic to the pod
  if (NODE_ENV === 'production') {
    await new Promise((res) => setTimeout(res, 60000));
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

if (aiOn) {
  process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
    trackException(err as Error, { stage: 'uncaughtException' });
    flushNow(() => process.exit(1));
  });

  process.on('unhandledRejection', (e: any) => {
    console.error('unhandledRejection', e);
    trackException(e instanceof Error ? e : new Error(String(e)), { stage: 'unhandledRejection' });
    flushNow(() => process.exit(1));
  });
}
