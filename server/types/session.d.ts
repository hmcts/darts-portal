import SecurityToken from './classes/securityToken';

declare module 'express-session' {
  interface SessionData {
    securityToken: SecurityToken | undefined;
    userType: 'internal' | 'external';
    bootstrapAuthOrigin?: string;
  }
}

export {};
