"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPTypes_1 = require("../types/HTTPTypes");
const calls_1 = require("../libs/calls");
const UserErrors_1 = require("../errors/UserErrors");
const ClientErrors_1 = require("../errors/ClientErrors");
const GetUserCommand_1 = __importDefault(require("../commands/user/GetUserCommand"));
const time_1 = require("../libs/time");
const TimeTypes_1 = require("../types/TimeTypes");
const Logging_1 = require("../utils/Logging");
const TimeDuration_1 = __importDefault(require("../models/units/TimeDuration"));
const GetSecretController = async (req, res) => {
    const { renew } = req.body;
    const { session } = req;
    try {
        // Try and find user in database
        const user = await new GetUserCommand_1.default({ email: session.getEmail() }).execute();
        // Re-new user secret
        if (renew) {
            await user.renewSecret();
        }
        // Fake some processing time for fetching of the secret
        await (0, time_1.sleep)(new TimeDuration_1.default(1, TimeTypes_1.TimeUnit.Second));
        // Success
        return res.json((0, calls_1.successResponse)(user.getSecret()));
    }
    catch (err) {
        Logging_1.logger.warn(err.message);
        if (err.code === UserErrors_1.ErrorUserDoesNotExist.code) {
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
exports.default = GetSecretController;
