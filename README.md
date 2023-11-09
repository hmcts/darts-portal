# DARTS portal

This is primarily an Angular app, but runs through a node.js server. There are two main reasons for the node.js server

- the web server for when the app is deployed in Kubernetes
- to proxy API requests to internally-facing backend API services, such as the DARTS API

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v20.0.0 or later
- [yarn](https://yarnpkg.com/) v3
- [Docker](https://www.docker.com)

### Install Dependencies

Install dependencies by executing the following command:

```bash
yarn
```

### Local Development Strategies

There are three different approaches to develop locally:

## 1. darts-portal with darts-api

To run darts-portal Angular & node.js frontend with [darts-api](https://github.com/hmcts/darts-api):

```bash
yarn dev
```

The applications's home page will be available at https://localhost:3000.

Note this is running both node.js and Angular and expects the ([darts-api](https://github.com/hmcts/darts-api)) to also be running locally to function correctly

## 2. darts-portal with stub API

To run darts-portal against node.js API stub:

```bash
yarn dev:darts-api-stub
```

## 3. darts-portal with staging API

To run darts-portal against staging API:

```bash
yarn dev:dev:darts-api-stg
```

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
