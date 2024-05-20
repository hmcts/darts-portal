export interface StubResponse {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  response: unknown;
  status: number;
}

export * from './security-roles';
