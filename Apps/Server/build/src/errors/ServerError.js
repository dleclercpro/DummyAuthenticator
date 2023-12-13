"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInvalidPassword = exports.ErrorInvalidEmail = exports.ServerError = void 0;
class ServerError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.ServerError = ServerError;
// Generic errors
class ErrorInvalidEmail extends ServerError {
    constructor(email) {
        super(ErrorInvalidEmail.code, `Invalid e-mail provided: ${email}`);
    }
}
exports.ErrorInvalidEmail = ErrorInvalidEmail;
ErrorInvalidEmail.code = -100;
class ErrorInvalidPassword extends ServerError {
    constructor() {
        super(ErrorInvalidPassword.code, `Invalid password provided.`);
    }
}
exports.ErrorInvalidPassword = ErrorInvalidPassword;
ErrorInvalidPassword.code = -101;
