import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from 'config';

export default () => {
  const sessionMiddleware: session.SessionOptions = {
    secret: config.get('secrets.darts.darts-portal-session-secret'),
    resave: false,
    saveUninitialized: true,
    cookie: {},
    name: config.get('session.cookieName'),
  };

  if (config.get('node-env') === 'production') {
    const redisClient = createClient({ url: config.get('secrets.darts.redis-connection-string') });
    redisClient.connect().catch(console.error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const redisStore = new (RedisStore as any)({
      client: redisClient,
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
