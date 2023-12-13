"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_validator_1 = require("email-validator");
const CreateUserCommand_1 = __importDefault(require("../commands/user/CreateUserCommand"));
const ClientErrors_1 = require("../errors/ClientErrors");
const ServerError_1 = require("../errors/ServerError");
const UserErrors_1 = require("../errors/UserErrors");
const calls_1 = require("../libs/calls");
const HTTPTypes_1 = require("../types/HTTPTypes");
const Logging_1 = require("../utils/Logging");
const Validation_1 = require("../utils/Validation");
const SignUpController = async (req, res) => {
    let { email, password } = req.body;
    try {
        // Sanitize input
        email = email.trim().toLowerCase();
        // Validate e-mail
        if (!(0, email_validator_1.validate)(email)) {
            throw new ServerError_1.ErrorInvalidEmail(email);
        }
        // Validate password
        if (!(0, Validation_1.validatePassword)(password)) {
            throw new ServerError_1.ErrorInvalidPassword();
        }
        // Create new user in database
        await new CreateUserCommand_1.default({ email, password }).execute();
        // Success
        return res.json((0, calls_1.successResponse)());
    }
    catch (err) {
        Logging_1.logger.warn(err.message);
        // User already exists
        if (err.code === UserErrors_1.ErrorUserAlreadyExists.code) {
            return res
                .status(HTTPTypes_1.HttpStatusCode.FORBIDDEN)
                .json((0, calls_1.errorResponse)(ClientErrors_1.ClientError.UserAlreadyExists));
        }
        // Invalid email
        if (err.code === ServerError_1.ErrorInvalidEmail.code) {
            return res
                .status(HTTPTypes_1.HttpStatusCode.BAD_REQUEST)
                .json((0, calls_1.errorResponse)(ClientErrors_1.ClientError.InvalidEmail));
        }
        // Invalid password
        if (err.code === ServerError_1.ErrorInvalidPassword.code) {
            return res
                .status(HTTPTypes_1.HttpStatusCode.BAD_REQUEST)
                .json((0, calls_1.errorResponse)(ClientErrors_1.ClientError.InvalidPassword));
        }
        // Unknown error
        return res
            .status(HTTPTypes_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HTTPTypes_1.HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
};
exports.default = SignUpController;
