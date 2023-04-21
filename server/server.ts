import express, { Request, Response } from 'express';

import * as bodyParser from 'body-parser';

import * as path from 'path';
import healthCheck from '@hmcts/nodejs-healthcheck';

import routes from './routes';

const app = express();
const appHealth = express();
const port = 3000;

const healthConfig = {
  checks: {},
  buildInfo: {},
};

healthCheck.addTo(appHealth, healthConfig);

app.use(express.static(path.resolve(process.cwd(), 'dist/darts-portal')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(appHealth);
app.use(routes());

app.get('*', (_: Request, res: Response) => {
  res.sendFile(path.resolve('dist/darts-portal/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
