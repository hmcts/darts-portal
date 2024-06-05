export class AuthenticationUtils {
  //Returns payload of JWT
  static parseJwt(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }

  //If token doesn't exist, or is expired, return as invalid
  static isJwtExpired(token: string | undefined) {
    console.log('isJwtExpired: token - ', token);
    try {
      if (token) {
        const payload = this.parseJwt(token);
        console.log('isJwtExpired: payload - ', payload);
        if (payload.exp) {
          //Create date from expiry, argument must be in ms so multiply by 1000
          const jwtExpiry = new Date(payload.exp * 1000);
          console.log('isJwtExpired: jwtExpiry - ', jwtExpiry);
          //If JWT expiry is after now, then return as valid
          if (jwtExpiry > new Date()) {
            console.log('isJwtExpired: false - jwtExpiry > new Date()', jwtExpiry, new Date());
            return false;
          }
          console.log('isJwtExpired: true - jwtExpiry <= new Date()', jwtExpiry, new Date());
        }
      }
      console.log('isJwtExpired: true - no error');
      return true;
    } catch (err) {
      console.log('isJwtExpired: true - error', err);
      return true;
    }
  }
}
