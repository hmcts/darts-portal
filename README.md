# DARTS portal

This is primarily an Angular app that runs through a node.js server. There are four main reasons for the node.js express server

- to serve the angular app when deployed in Kubernetes
- to proxy API requests to internally-facing backend API services, such as the DARTS API
- to handle auth / user session
- to provide a stubbed API for development

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v22.22.3 or later
- [yarn](https://yarnpkg.com/) v3
- [Docker](https://www.docker.com)(optional)

### Install Dependencies

Install dependencies by executing the following command:

```bash
yarn
```

### Local Development Strategies

There are four different ways to develop locally:

## 1. API Stub

To run darts-portal against node.js API stub:

```bash
yarn dev:darts-api-stub
```

## 2. Run in staging environment

To run darts-portal against staging API :

```bash
yarn dev:darts-api-stg
```

## 3. Demo environment

To run darts-portal locally against demo API:

```bash
yarn dev:darts-api-demo
```

## 4. Local darts-portal with local darts-api

To run darts-portal Angular & node.js frontend with [darts-api](https://github.com/hmcts/darts-api):

```bash
yarn dev
```

The applications's home page will be available at https://localhost:3000.

Note this is running both node.js and Angular and expects the ([darts-api](https://github.com/hmcts/darts-api)) to also be running locally to function correctly

## Build

Run `yarn:build` to build the project. The build artifacts will be stored in the `dist/` directory. This compiles both the node.js server-side code and angular code.

## Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint) and [Prettier](https://prettier.io/)

Running the linting:

```bash
yarn lint
```

You can fix prettier formatting issues using:

```bash
yarn prettier:fix
```

## Running unit/integration tests

Run `yarn test` or `yarn test:watch` to execute the unit tests via [Jest](https://jestjs.io/).

`--silent` flag reduces noise in console when running tests.

## Running end-to-end tests

Run `yarn test:functional` to execute the end-to-end tests using Cypress, this includes accessibility checks via axe-core (WCAG22AA standards).

Run `yarn cypress` to open the cypress console, very useful for debugging tests.

## Angular code scaffolding

Run `yarn ng generate component component-name` to generate a new component. You can also use `yarn ng generate directive|pipe|service|class|guard|interface|enum|module`.

Note the requirement for prefixing the `ng` commands with `yarn`

## Feature Flags
[Launch Darkly](https://launchdarkly.com/) is used for feature flags in DARTS. The detailed instructions on how to set it up from scratch can be found in Confluence.

### Adding a new flag
Detailed instruction about how to setup a new feature flag can be found in Confluence. As a quick guide:
1. Create the flag in launch darkly
1. Add the key to [feature flag defaults](src/app/core/services/app-config/feature-flag-defaults.constant.ts) along with it's default value (currently feature flags are assumed to have a boolean value).
1. Add the key to the list of dev overrides [development.json](config/development.json) with the value to use by default in dev.
1. Use the following code where the value is needed.
```ts
private featureFlagService = inject(FeatureFlagService);

this.featureFlagService.isEnabled('your-flag-key');
```

### Local development
By default local development will use the local overrides, which means it will not connect to Launch Darkly and instead use values for the feature flags set in [development.json](config/development.json). This allows developers to test out varaitions of feature flags by changing thier values here instead of in Launch Darkly.

If there is a need to connect to Launch Darkly at any point, then local overrides should be set to false and the SDK and client ID for Launch Darkly need to be set. This can be set with env vars before running the application:
```bash
export LAUNCHDARKLY_LOCAL_OVERRIDE=false
export LAUNCHDARKLY_CLIENT_ID='launch-darkly-client-side-id'
export LAUNCHDARKLY_SDK_KEY='launch-darkly-server-sdk-key'
```
