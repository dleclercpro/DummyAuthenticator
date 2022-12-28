import { ServerError } from './ServerError';

export class ErrorMissingSessionId extends ServerError {
    public static code = -100;
    
    constructor() {
        super(ErrorMissingSessionId.code, `Missing session ID.`);
    }
}

export class ErrorInvalidSessionId extends ServerError {
    public static code = -101;
    
    constructor(id: string) {
        super(ErrorInvalidSessionId.code, `Invalid session ID: ${id}`);
    }
}

export class ErrorExpiredSession extends ServerError {
    public static code = -102;
    
    constructor(id: string) {
        super(ErrorExpiredSession.code, `Expired session ID: ${id}`);
    }
}