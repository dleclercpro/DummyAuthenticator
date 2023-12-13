"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorUserWrongPassword = exports.ErrorUserDoesNotExist = exports.ErrorUserAlreadyExists = void 0;
const ServerError_1 = require("./ServerError");
class ErrorUserAlreadyExists extends ServerError_1.ServerError {
    constructor(user) {
        super(ErrorUserAlreadyExists.code, `User already exists: ${user.stringify()}`);
    }
}
exports.ErrorUserAlreadyExists = ErrorUserAlreadyExists;
ErrorUserAlreadyExists.code = -300;
class ErrorUserDoesNotExist extends ServerError_1.ServerError {
    constructor(email) {
        super(ErrorUserDoesNotExist.code, `User does not exist: ${email}`);
    }
}
exports.ErrorUserDoesNotExist = ErrorUserDoesNotExist;
ErrorUserDoesNotExist.code = -301;
class ErrorUserWrongPassword extends ServerError_1.ServerError {
    constructor(user) {
        super(ErrorUserWrongPassword.code, `Wrong password entered for user: ${user.stringify()}`);
    }
}
exports.ErrorUserWrongPassword = ErrorUserWrongPassword;
ErrorUserWrongPassword.code = -302;
