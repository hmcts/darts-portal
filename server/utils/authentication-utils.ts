import axios from 'axios';
import SecurityToken from 'server/types/classes/securityToken';

export class AuthenticationUtils {
  //Returns payload of JWT
  static parseJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  //If token doesn't exist, or is expired, return as invalid
  static isJwtExpired(token: string | undefined) {
    try {
      if (token) {
        const payload = this.parseJwt(token);
        if (payload.exp) {
          //Create date from expiry, argument must be in ms so multiply by 1000
          const jwtExpiry = new Date(payload.exp * 1000);
          //If JWT expiry is after now, then return as valid
          if (jwtExpiry > new Date()) {
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      return true;
    }
  }

  static async refreshJwt(url: string, refreshToken: string): Promise<SecurityToken> {
    const result = await axios.post<SecurityToken>(
      url,
      {
        refresh_token: refreshToken,
      },
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
    );
    const securityToken = result.data;
    return securityToken;
  }
}
