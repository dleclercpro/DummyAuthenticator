"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
const AuthConfig_1 = require("../config/AuthConfig");
const string_1 = require("../libs/string");
const validatePassword = (password, options = AuthConfig_1.PASSWORD_OPTIONS) => {
    let isValid = true;
    if (options.minLength) {
        isValid = password.length >= options.minLength;
    }
    if (isValid && options.minNumbers) {
        isValid = password.split('').filter(c => (0, string_1.isNumerical)(c)).length >= options.minNumbers;
    }
    if (isValid && options.minSymbols) {
        isValid = password.split('').filter(c => !(0, string_1.isAlphanumerical)(c)).length >= options.minSymbols;
    }
    return isValid;
};
exports.validatePassword = validatePassword;
