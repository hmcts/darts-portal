import * as express from 'express';
import { dartsApiUrl } from '../config';
import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

const allowedUrlPath = '/api';

async function callApi<T extends unknown>(apiUrlPath: string, method: HTTPMethod, req: Request): Promise<T> {
  const m = method.toLowerCase();
  const result = await axios({
    method: m,
    url: `${dartsApiUrl}${apiUrlPath}`,
    data: ['get', 'delete'].includes(m) ? undefined : req.body,
    validateStatus: () => true,
  });
  return result.data;
}

function apiProxy(): (req: Request, res: Response, next: NextFunction) => Promise<Response | void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const apiPath = req.originalUrl;
    if (apiPath.indexOf(allowedUrlPath) === -1) {
      return next(`Not allowed to call apiPath = ${apiPath}, allowed path "${allowedUrlPath}"`);
    }
    try {
      const result = await callApi(apiPath.replace(allowedUrlPath, ''), req.method as HTTPMethod, req);
      return res.json(result);
    } catch (err) {
      console.error('Error calling API', err);
      return res.status(500).send();
    }
  };
}

export function init(): Router {
  const router = express.Router();
  router.use('/api/*', apiProxy());
  return router;
}
