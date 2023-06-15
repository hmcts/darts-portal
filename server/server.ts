import express, { Request, Response } from 'express';
import nunjucks from 'nunjucks';

import * as bodyParser from 'body-parser';

import * as path from 'path';
import healthCheck from '@hmcts/nodejs-healthcheck';

import routes from './routes';

export const startServer = () => {
  const app = express();
  const appHealth = express();

  const healthConfig = {
    checks: {},
    buildInfo: {},
  };

  healthCheck.addTo(appHealth, healthConfig);

  app.use('/assets', express.static(path.join(__dirname, './assets')));
  app.use(express.static(path.resolve(process.cwd(), 'dist/darts-portal')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  nunjucks.configure('server/views', {
    autoescape: true,
    express: app,
  });

  app.use(appHealth);
  app.use(routes());

  app.get('*', (_: Request, res: Response) => {
    res.sendFile(path.resolve('dist/darts-portal/index.html'));
  });

  return app;
};
