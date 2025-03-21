import axios from 'axios';
import { Request } from 'express';
import { DateTime } from 'luxon';
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

  /**
   * Checks if a session is valid (not expired and has a valid user).
   */
  static isValidSession(req: Request): boolean {
    const expiry = req.session?.expiry;
    const sessionExpired = expiry && DateTime.now() > DateTime.fromISO(expiry);
    const userIdNotPresent = !req.session?.securityToken?.userState?.userId;

    return !(sessionExpired || userIdNotPresent);
  }

  static async refreshJwt(url: string, refreshToken: string): Promise<SecurityToken> {
    const { data } = await axios.post<SecurityToken>(
      url,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return data;
  }
}
