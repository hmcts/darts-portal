import pa11y from 'pa11y';

import { testUrl } from './config';

export const pathsToTest = ['/', '/search', '/transcriptions', '/case/1', '/case/1/hearing/1', '/page-not-found'];
//List of paths that depend on UserState to load
export const pathsToTestUserState = ['/audios'];

//Neccessary to login to application so that we can test pages that require UserState (e.g. Your Audios)
const loginActions = [
  `navigate to ${testUrl}/login`,
  'check field #user-type-2',
  'click element .govuk-button',
  'click element #login',
  'wait for element #notifications to be visible',
];

//Flag to IGNORE 'known' issues for now, also hides them from logs
const ignoreKnownIssues = true;
//Contains 'code' of known issues to ignore when exiting process
const knownIssues = ['color-contrast'];
//pa11y will fail if errors appear that aren't known
let error = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const issuesArr: any = [];
let newIssueCount = 0;
let totalIssueCount = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addNewIssue(issue: any) {
  newIssueCount++;
  issuesArr.push(issue);
  error = true;
}

//This function pa11y's each page that depends on UserState and runs through loginActions
async function pa11yPagesUserState() {
  for (const x in pathsToTestUserState) {
    const actionSteps = loginActions;
    const path = pathsToTestUserState[x];
    actionSteps.push(`navigate to ${testUrl}${path}`);
    actionSteps.push(`wait for .govuk-footer__copyright-logo to be visible`);

    const results = await Promise.all(
      pathsToTestUserState.map((path) =>
        pa11y(`${testUrl}${path}`, {
          runners: ['axe', 'htmlcs'],
          actions: actionSteps,
        })
      )
    );

    results.forEach((result) => {
      console.log(`URL: ${result.pageUrl}`);
      result.issues.forEach((issue) => {
        //If issue is NOT a known issue, add it
        knownIssues.indexOf(issue.code) == -1 && addNewIssue(issue);
        //If we're not ignoring known issues, add to issues array
        !ignoreKnownIssues && issuesArr.push(issue);
      });
      console.log('Number of issues:', result.issues.length);
      totalIssueCount += result.issues.length;
    });
  }
}

async function pa11yPages() {
  const results = await Promise.all(
    pathsToTest.map((path) =>
      pa11y(`${testUrl}${path}`, {
        runners: ['axe', 'htmlcs'],
      })
    )
  );

  results.forEach((result) => {
    console.log(`URL: ${result.pageUrl}`);
    result.issues.forEach((issue) => {
      //If issue is NOT a known issue, add it
      knownIssues.indexOf(issue.code) == -1 && addNewIssue(issue);
      //If we're not ignoring known issues, add to issues array
      !ignoreKnownIssues && issuesArr.push(issue);
    });
    console.log('Number of issues:', result.issues.length);
    totalIssueCount += result.issues.length;
  });
}

async function runPa11y() {
  console.log('Ignore known issues set to ', ignoreKnownIssues);
  ignoreKnownIssues && console.log('Ignoring known issues, including ', knownIssues);

  try {
    await pa11yPagesUserState();
    await pa11yPages();

    console.log('--');
    console.log('pa11y successfully run');
    issuesArr.length > 0 && console.log(issuesArr);
    issuesArr.length > 0 && ignoreKnownIssues && console.log('Please fix unknown issues, see above.');
    console.log('Total number of issues:', totalIssueCount);
    console.log('Number of NEW issues: ', newIssueCount);

    if (error) {
      console.log('Unknown issue(s) have been detected, failing pa11y');
      process.exit(totalIssueCount);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.log('Error running pa11y', error);
    process.exit(1);
  }
}

runPa11y();
