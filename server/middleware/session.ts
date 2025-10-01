import config from 'config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { Redis } from 'ioredis';
import { trackException } from 'server/app-insights';

export default () => {
  const sessionTtl: number = parseInt(config.get('session.ttlInSeconds'), 10);

  const sessionMiddleware: session.SessionOptions = {
    secret: config.get('secrets.darts.darts-portal-session-secret'),
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: 'strict' },
    name: config.get('session.cookieName'),
  };

  if (config.get('node-env') === 'production') {
    // if the redis connection string is overridden, use it
    const redisConnectionString: string =
      config.get('session.overriddenNotSecretRedisConnectionString') ||
      config.get('secrets.darts.redis-connection-string');

    let redis: Redis | undefined;
    try {
      redis = new Redis(redisConnectionString);

      redis.on('error', (err) => {
        console.error('REDIS ERROR', err);
        trackException(err as Error, { source: 'ioredis' });
      });
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      trackException(error as Error, { source: 'ioredis' });
    }

    if (!redis) {
      const e = new Error('Redis client not initialized');
      trackException(e, { source: 'ioredis', stage: 'PreStore' });
    }

    try {
      const redisStore = new RedisStore({
        client: redis!,
        prefix: (config.get('session.prefix') as string) + ':',
        ttl: sessionTtl,
      });
      sessionMiddleware.store = redisStore;
    } catch (err) {
      console.error('Error creating Redis store:', err);
      trackException(err as Error, { stage: 'RedisStoreCtor' });
    }

    const isSecureHost = (config.get('hostname') as string).startsWith('https://');
    if (isSecureHost && sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  return session(sessionMiddleware);
};
