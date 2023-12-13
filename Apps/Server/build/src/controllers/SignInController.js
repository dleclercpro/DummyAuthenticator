"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPTypes_1 = require("../types/HTTPTypes");
const calls_1 = require("../libs/calls");
const SignInCommand_1 = __importDefault(require("../commands/auth/SignInCommand"));
const UserErrors_1 = require("../errors/UserErrors");
const ClientErrors_1 = require("../errors/ClientErrors");
const email_validator_1 = require("email-validator");
const ServerError_1 = require("../errors/ServerError");
const AuthConfig_1 = require("../config/AuthConfig");
const Logging_1 = require("../utils/Logging");
const SignInController = async (req, res) => {
    let { email, password, staySignedIn } = req.body;
    try {
        // Sanitize input
        email = email.trim().toLowerCase();
        // Validate e-mail
        if (!(0, email_validator_1.validate)(email)) {
            throw new ServerError_1.ErrorInvalidEmail(email);
        }
        // Try to sign user in
        const { session } = await new SignInCommand_1.default({ email, password, staySignedIn }).execute();
        // Set cookie with session ID on client's browser
        res.cookie(AuthConfig_1.SESSION_COOKIE, session.getId());
        // Success
        return res.json((0, calls_1.successResponse)());
    }
    catch (err) {
        Logging_1.logger.warn(err.message);
        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (err.code === UserErrors_1.ErrorUserDoesNotExist.code ||
            err.code === ServerError_1.ErrorInvalidEmail.code ||
            err.code === UserErrors_1.ErrorUserWrongPassword.code) {
            return res
                .status(HTTPTypes_1.HttpStatusCode.FORBIDDEN)
                .json((0, calls_1.errorResponse)(ClientErrors_1.ClientError.InvalidCredentials));
        }
        // Unknown error
        return res
            .status(HTTPTypes_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HTTPTypes_1.HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
};
exports.default = SignInController;
