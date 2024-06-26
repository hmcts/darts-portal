export interface StubResponse {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  response: unknown;
  status: number;
}

export * from './events';
export * from './security-roles';
export * from './transformed-media';
