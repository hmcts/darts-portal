import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import config from 'config';

export default () => {
  const sessionMiddleware: session.SessionOptions = {
    // TODO: https://tools.hmcts.net/jira/browse/DMP-434
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  };

  if (config.get('node-env') === 'production') {
    const redisClient = createClient({ url: config.get('secrets.darts.redis-connection-string') });
    redisClient.connect().catch(console.error);
    const redisStore = new (RedisStore as any)({
      client: redisClient,
      prefix: 'darts-portal-session:',
    });
    sessionMiddleware.store = redisStore;

    if (sessionMiddleware.cookie) {
      sessionMiddleware.cookie.secure = true; // serve secure cookies
    }
  }

  return session(sessionMiddleware);
};
