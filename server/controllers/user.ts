import axios, { AxiosError } from 'axios';
import config from 'config';
import * as express from 'express';
import { Request, Response, Router } from 'express';
import { trackException } from '../app-insights';
async function postRefreshUserState(req: Request, res: Response): Promise<Response> {
  if (!req.session.securityToken) {
    return res.sendStatus(401);
  }

  const accessToken = req.session.securityToken.accessToken;
  const userId = req.session.securityToken.userState?.userId;
  try {
    const result = await axios(`${config.get('darts-api.url')}/userstate`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        user_id: userId,
      },
    });
    if (result.data && req.session.securityToken?.userState) {
      req.session.securityToken.userState = result.data;
    }
    return res.json(req.session.securityToken?.userState);
  } catch (err) {
    console.error(`Error getting userstate from API`, err);
    trackException(err as Error, { source: 'user', stage: 'postRefreshUserState' });
    if (err instanceof AxiosError) {
      return res.sendStatus(err.status as number);
    }
    return res.sendStatus(500);
  }
}

export function init(): Router {
  const router = express.Router();

  router.get('/profile', (req: Request, res: Response) => {
    res.json(req.session.securityToken?.userState);
  });

  router.post('/refresh-profile', async (req: Request, res: Response) => {
    await postRefreshUserState(req, res);
  });

  return router;
}
