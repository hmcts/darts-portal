export class AuthenticationUtils {
    //Returns payload of JWT
    static parseJwt(token: string) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }
    
    //If token doesn't exist, or is expired, return as invalid
    static jwtExpired(token: string | undefined) {
        try {
        if (token) {
            const payload = this.parseJwt(token);
            if (payload.exp) {
            //Create date from expiry, argument must be in ms so multiply by 1000
            const jwtExpiry = new Date(payload.exp * 1000);
            console.log('expiry ' ,jwtExpiry);
            console.log('now ' ,new Date());
            //If JWT expiry is after now, then return as valid
            if (jwtExpiry > new Date()) {
                return false;
            }
            }
        }
        return true;
        } catch {
        return true;
        }
    }

    static redirectLogin(token: string | undefined){        
        if (token) {
            if (!this.jwtExpired(token)) {
                return false;
            }
        }
        return true;
    }
}