import express, { Request, Response } from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';

import * as path from 'path';
import healthCheck from '@hmcts/nodejs-healthcheck';

import routes from './routes';

/**
 * Options for starting the express server
 *
 * `disableAuthentication`: should be used for testing purposes only, defaults to false.
 */
type StartServerOptions = {
  disableAuthentication: boolean;
};

export const startServer = ({ disableAuthentication }: StartServerOptions = { disableAuthentication: false }) => {
  const app = express();
  const appHealth = express();

  const healthConfig = {
    checks: {},
    buildInfo: {},
  };

  healthCheck.addTo(appHealth, healthConfig);

  app.use('/assets', express.static(path.join(__dirname, './assets')));
  app.use(express.static(path.resolve(process.cwd(), 'dist/darts-portal')));

  const sessionMiddleware: session.SessionOptions = {
    // TODO: https://tools.hmcts.net/jira/browse/DMP-434
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    if (sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  app.use(session(sessionMiddleware));

  nunjucks.configure('server/views', {
    autoescape: true,
    express: app,
  });

  app.use(appHealth);
  app.use(routes(disableAuthentication));

  // if routes not handles above, they should be handled by angular
  app.get('*', (_: Request, res: Response) => {
    res.sendFile(path.resolve('dist/darts-portal/index.html'));
  });

  return app;
};
