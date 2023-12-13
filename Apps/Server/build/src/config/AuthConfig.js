"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_OPTIONS = exports.N_PASSWORD_SALT_ROUNDS = exports.SESSION_DURATION = exports.SESSION_COOKIE = void 0;
const TimeTypes_1 = require("../types/TimeTypes");
exports.SESSION_COOKIE = process.env.SESSION_COOKIE;
exports.SESSION_DURATION = { time: 15, unit: TimeTypes_1.TimeUnit.Minute };
exports.N_PASSWORD_SALT_ROUNDS = 12;
exports.PASSWORD_OPTIONS = {
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
};
