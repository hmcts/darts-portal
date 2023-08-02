import SecurityToken from './classes/securityToken'

declare module 'express-session' {
  interface SessionData {
    securityToken: SecurityToken | undefined;
  }
}

export {};
