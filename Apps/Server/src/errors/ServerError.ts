import { HOURLY_LOGIN_MAX_ATTEMPTS } from '../config/AuthConfig';

export abstract class ServerError extends Error {
    public code: number;
    
    constructor(code: number, message: string) {
        super(message);

        this.code = code;
    }
}



// Generic errors
export class ErrorInvalidEmail extends ServerError {
    public static code = -100;
    
    constructor(email: string) {
        super(ErrorInvalidEmail.code, `Invalid e-mail provided: ${email}`);
    }
}

export class ErrorInvalidPassword extends ServerError {
    public static code = -101;
    
    constructor() {
        super(ErrorInvalidPassword.code, `Invalid password provided.`);
    }
}

export class ErrorInvalidToken extends ServerError {
    public static code = -102;

    constructor() {
        super(ErrorInvalidToken.code, `Invalid token provided.`);
    }
}

export class ErrorMissingToken extends ServerError {
    public static code = -103;

    constructor() {
        super(ErrorMissingToken.code, `Missing token.`);
    }
}

export class ErrorExpiredToken extends ServerError {
    public static code = -104;

    constructor() {
        super(ErrorExpiredToken.code, `Expired token.`);
    }
}

export class ErrorTokenAlreadyUsed extends ServerError {
    public static code = -105;

    constructor() {
        super(ErrorTokenAlreadyUsed.code, `Token already used.`);
    }
}

export class ErrorNewerTokenIssued extends ServerError {
    public static code = -106;

    constructor() {
        super(ErrorNewerTokenIssued.code, `A newer token exists.`);
    }
}

export class ErrorNoMoreLoginAttempts extends ServerError {
    public static code = -107;

    constructor(user: string, attemptCount: number) {
        super(ErrorNoMoreLoginAttempts.code, `Number of maximum login attempts per hour reached for user '${user}': (${attemptCount}/${HOURLY_LOGIN_MAX_ATTEMPTS})`);
    }
}

export class ErrorNewPasswordMustBeDifferent extends ServerError {
    public static code = -108;
    
    constructor() {
        super(ErrorNewPasswordMustBeDifferent.code, `New password must be different than the previous one.`);
    }
}