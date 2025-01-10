import UserState from './userState';

class SecurityToken {
  userState: UserState | undefined;
  accessToken!: string;
  refreshToken!: string;
}

export = SecurityToken;
