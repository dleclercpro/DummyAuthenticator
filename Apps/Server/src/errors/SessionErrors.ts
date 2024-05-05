import { ServerError } from './ServerError';

export class ErrorNoSession extends ServerError {
    public static code = -100;
    
    constructor() {
        super(ErrorNoSession.code, `No session found.`);
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