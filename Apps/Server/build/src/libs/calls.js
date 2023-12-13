"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
/**
 * Generate a successful response for the client app
 * @param data
 * @param code
 * @returns
 */
const successResponse = (data, code = 0) => ({
    code,
    data,
});
exports.successResponse = successResponse;
/**
 * Generate an error response for the client app
 * @param data
 * @param code
 * @returns
 */
const errorResponse = (error, data, code = -1) => ({
    code,
    error,
    data,
});
exports.errorResponse = errorResponse;
