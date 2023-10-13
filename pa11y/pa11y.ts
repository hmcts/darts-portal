import pa11y from 'pa11y';

import { testUrl } from './config';

export const pathsToTest = [
  '/',
  '/login',
  '/search',
  '/audios',
  '/transcriptions',
  '/case/1',
  '/case/1/hearing/1',
  '/page-not-found',
];

//Contains 'code' of known issues to ignore when exiting process
const knownIssues = ['color-contrast'];
//pa11y will fail if errors appear that aren't known
let error = false;

async function runPa11y() {
  try {
    const results = await Promise.all(
      pathsToTest.map((path) =>
        pa11y(`${testUrl}${path}`, {
          runners: ['axe', 'htmlcs'],
        })
      )
    );

    results.forEach((result) => {
      console.log(`URL: ${result.pageUrl}`);
      console.log(`Number of issues: ${result.issues.length}`);
      if (result.issues.length > 0) {
        console.log(result.issues);
        // If issues contains an issue that isn't known
        if (result.issues.some((r) => !knownIssues.includes(r.code))) {
          console.log('Unknown issue(s) found for ', result.pageUrl);
          error = true;
        }
      }
      console.log('--');
    });

    const aggregatedResultCount = results.reduce((aggregated, r) => aggregated + r.issues.length, 0);
    console.log('Total number of issues:', aggregatedResultCount);
    if (error) {
      console.log('Unknown issue(s) have been detected');
      process.exit(aggregatedResultCount);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.log('Error running pa11y', error);
    process.exit(1);
  }
}

runPa11y();
