import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import nunjucks from 'nunjucks';
import config from 'config';
import * as path from 'path';
import healthCheck from '@hmcts/nodejs-healthcheck';

import { session } from './middleware';
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

  app.use(
    '/assets',
    express.static(path.join(__dirname, './assets'), {
      setHeaders: function (res) {
        // set CORS headers for assets so that they can be fetched from the Azure AD B2C login screen
        res.set('Access-Control-Allow-Origin', config.get('authentication.azureAdB2cOriginHost'));
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      },
    })
  );
  app.use(express.static(path.resolve(process.cwd(), 'dist/darts-portal')));
  app.use(cookieParser());
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
  }
  app.use(session());

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
