import pa11y from 'pa11y';
import { startServer } from '../server/server';
import config from 'config';

import { testUrl } from './config';

export const pathsToTest = ['/', '/inbox', '/audios', '/transcriptions'];

async function runPa11y() {
  try {
    const results = await Promise.all(pathsToTest.map((path) => pa11y(`${testUrl}${path}`)));

    results.forEach((result) => {
      console.log(`URL: ${result.pageUrl}`);
      console.log(`Number of issues: ${result.issues.length}`);
      if (result.issues.length > 0) {
        console.log(result.issues);
      }
      console.log('--');
    });

    const aggregatedResultCount = results.reduce((aggregated, r) => aggregated + r.issues.length, 0);
    console.log('Total number of issues:', aggregatedResultCount);
    process.exit(aggregatedResultCount);
  } catch (error) {
    console.log('Error running pa11y', error);
    process.exit(1);
  }
}

const PORT = config.get('port');
const READY_MESSAGE = `> Ready on http://localhost:${PORT}`;

const server = startServer({ disableAuthentication: true });

server.listen(PORT, () => {
  console.log(READY_MESSAGE);
  console.log('--');
  runPa11y();
});
