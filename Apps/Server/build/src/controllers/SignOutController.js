"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SignOutCommand_1 = __importDefault(require("../commands/auth/SignOutCommand"));
const AuthConfig_1 = require("../config/AuthConfig");
const ClientErrors_1 = require("../errors/ClientErrors");
const UserErrors_1 = require("../errors/UserErrors");
const calls_1 = require("../libs/calls");
const HTTPTypes_1 = require("../types/HTTPTypes");
const Logging_1 = require("../utils/Logging");
const SignOutController = async (req, res) => {
    const { session } = req;
    try {
        await new SignOutCommand_1.default({ session }).execute();
        // Remove session cookie in client
        res.clearCookie(AuthConfig_1.SESSION_COOKIE);
        // Success
        return res.json((0, calls_1.successResponse)());
    }
    catch (err) {
        Logging_1.logger.warn(err.message);
        // Do not tell client why user can't sign out: just say they
        // are unauthorized!
        if (err.code === UserErrors_1.ErrorUserDoesNotExist.code) {
            return res
                .status(HTTPTypes_1.HttpStatusCode.UNAUTHORIZED)
                .json((0, calls_1.errorResponse)(ClientErrors_1.ClientError.InvalidCredentials));
        }
        // Unknown error
        return res
            .status(HTTPTypes_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HTTPTypes_1.HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
};
exports.default = SignOutController;
