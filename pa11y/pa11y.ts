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

//Flag to IGNORE 'known' issues for now, also hides them from logs
const ignoreKnownIssues = true;
//Contains 'code' of known issues to ignore when exiting process
const knownIssues = ['color-contrast'];
//pa11y will fail if errors appear that aren't known
let error = false;

async function runPa11y() {
  try {
    console.log('Ignore known issues set to ', ignoreKnownIssues);

    const results = await Promise.all(
      pathsToTest.map((path) =>
        pa11y(`${testUrl}${path}`, {
          runners: ['axe', 'htmlcs'],
        })
      )
    );

    results.forEach((result) => {
      let newIssueCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issuesArr: any = [];
      console.log(`URL: ${result.pageUrl}`);
      if (result.issues.length > 0) {
        result.issues.forEach((issue) => {
          if (knownIssues.indexOf(issue.code) == -1) {
            //Issue is unknown
            newIssueCount++;
            issuesArr.push(issue);
            error = true;
          } else if (!ignoreKnownIssues) {
            //Adds known issues
            issuesArr.push(issue);
          }
        });
      }
      console.log(`Number of total issues (including known): ${result.issues.length}`);
      console.log('Number of NEW issues: ', newIssueCount);

      if (ignoreKnownIssues) {
        console.log('Ignoring known issues');
      } else if (!ignoreKnownIssues && !error) {
        console.log('Showing known issues');
        console.log(issuesArr);
      }
      if (issuesArr.length > 0 && ignoreKnownIssues) {
        console.log(issuesArr);
        console.log('Please fix the above');
      }

      console.log('--');
    });

    const aggregatedResultCount = results.reduce((aggregated, r) => aggregated + r.issues.length, 0);
    console.log('Total number of issues:', aggregatedResultCount);
    if (error) {
      console.log('Unknown issue(s) have been detected, fix above');
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
