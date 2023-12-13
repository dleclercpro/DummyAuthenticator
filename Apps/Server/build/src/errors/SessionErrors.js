"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorExpiredSession = exports.ErrorInvalidSessionId = exports.ErrorMissingSessionId = void 0;
const ServerError_1 = require("./ServerError");
class ErrorMissingSessionId extends ServerError_1.ServerError {
    constructor() {
        super(ErrorMissingSessionId.code, `Missing session ID.`);
    }
}
exports.ErrorMissingSessionId = ErrorMissingSessionId;
ErrorMissingSessionId.code = -100;
class ErrorInvalidSessionId extends ServerError_1.ServerError {
    constructor(id) {
        super(ErrorInvalidSessionId.code, `Invalid session ID: ${id}`);
    }
}
exports.ErrorInvalidSessionId = ErrorInvalidSessionId;
ErrorInvalidSessionId.code = -101;
class ErrorExpiredSession extends ServerError_1.ServerError {
    constructor(id) {
        super(ErrorExpiredSession.code, `Expired session ID: ${id}`);
    }
}
exports.ErrorExpiredSession = ErrorExpiredSession;
ErrorExpiredSession.code = -102;
