import config from 'config';
import RedisStore from 'connect-redis';
import session from 'express-session';
import { Redis } from 'ioredis';

export default () => {
  const sessionMiddleware: session.SessionOptions = {
    secret: config.get('secrets.darts.darts-portal-session-secret'),
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: 'strict' },
    name: config.get('session.cookieName'),
  };

  if (config.get('node-env') === 'production') {
    const redis = new Redis(config.get('secrets.darts.redis-connection-string'));
    redis.on('error', (err) => console.error('REDIS ERROR', err));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const redisStore = new (RedisStore as any)({
      client: redis,
      prefix: config.get('session.prefix') + ':',
      ttl: config.get('session.ttlInSeconds'),
    });
    sessionMiddleware.store = redisStore;

    if (sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  return session(sessionMiddleware);
};
