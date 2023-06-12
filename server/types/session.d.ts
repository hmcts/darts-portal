declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
    accessToken?: string;
  }
}

export {};
