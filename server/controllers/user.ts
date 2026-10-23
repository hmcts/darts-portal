import { createHmac } from 'node:crypto';
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

/**
 * Returns the logged-in user's ID in LaunchDarkly's context format, together with a signature.
 * This is required for LaunchDarkly secure mode so the logged-in user gets their own flag
 * values and cannot request another user's flags just by changing the user ID.
 */
export function getLaunchDarklyUserContext(req: Request, res: Response): Response {
  res.set('Cache-Control', 'no-store');
  const user = req.session?.securityToken?.userState;
  if (!user || !Number.isSafeInteger(user.userId) || user.userId <= 0) {
    return res.sendStatus(401);
  }
  if (!user.isActive) {
    return res.sendStatus(403);
  }

  const sdkKey = config.get('secrets.darts.LaunchDarklySdkKey');
  if (typeof sdkKey !== 'string' || !sdkKey.trim()) {
    console.error('LaunchDarklySdkKey secret is either missing, empty, or not a string.');
    return res.sendStatus(500);
  }

  const context = { kind: 'user', key: String(user.userId) };
  const hash = createHmac('sha256', sdkKey.trim()).update(context.key, 'utf8').digest('hex');
  return res.json({ context, hash });
}

export function init(): Router {
  const router = express.Router();

  router.get('/launchdarkly-context', getLaunchDarklyUserContext);

  router.get('/profile', (req: Request, res: Response) => {
    res.json(req.session.securityToken?.userState);
  });

  router.post('/refresh-profile', async (req: Request, res: Response) => {
    await postRefreshUserState(req, res);
  });

  return router;
}
