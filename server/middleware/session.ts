import config from 'config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { Redis } from 'ioredis';

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
    const redis = new Redis(redisConnectionString);
    redis.on('error', (err) => console.error('REDIS ERROR', err));

    const redisStore = new RedisStore({
      client: redis,
      prefix: config.get('session.prefix') + ':',
      ttl: sessionTtl,
    });
    sessionMiddleware.store = redisStore;

    const isSecureHost = (config.get('hostname') as string).startsWith('https://');
    if (isSecureHost && sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  return session(sessionMiddleware);
};
