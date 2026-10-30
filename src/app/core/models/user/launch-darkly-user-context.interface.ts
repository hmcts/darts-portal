export interface LaunchDarklyUserContext {
  context: {
    kind: 'user';
    key: string;
  };
  hash: string;
}
