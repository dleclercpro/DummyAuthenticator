export abstract class ServerError extends Error {
    public code: number;

    constructor(code: number, message: string) {
        super(message);

        this.code = code;
    }
}

export class ErrorInvalidEmail extends ServerError {
    public static code = -100;
    
    constructor(email: string) {
        super(ErrorInvalidEmail.code, `Invalid e-mail provided: ${email}`);
    }
}

export class ErrorInvalidSessionId extends ServerError {
    public static code = -101;
    
    constructor(id: string) {
        super(ErrorInvalidSessionId.code, `Invalid session ID: ${id}`);
    }
}