"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMiddleware = void 0;
const AuthConfig_1 = require("../config/AuthConfig");
const ClientErrors_1 = require("../errors/ClientErrors");
const SessionErrors_1 = require("../errors/SessionErrors");
const calls_1 = require("../libs/calls");
const Session_1 = __importDefault(require("../models/Session"));
const HTTPTypes_1 = require("../types/HTTPTypes");
const TimeTypes_1 = require("../types/TimeTypes");
const Logging_1 = require("../utils/Logging");
const SessionMiddleware = async (req, res, next) => {
    const { [AuthConfig_1.SESSION_COOKIE]: sessionId } = req.cookies;
    try {
        // Missing session ID
        if (!sessionId) {
            throw new SessionErrors_1.ErrorMissingSessionId();
        }
        // Try to find user session
        const session = await Session_1.default.findById(sessionId);
        // Invalid session ID
        if (!session) {
            throw new SessionErrors_1.ErrorInvalidSessionId(sessionId);
        }
        // Is session expired?
        if (session.getExpirationDate() <= new Date()) {
            throw new SessionErrors_1.ErrorExpiredSession(sessionId);
        }
        // Extend session duration if desired on every
        // further request
        if (session.staySignedIn) {
            await session.extend(1, TimeTypes_1.TimeUnit.Hour);
        }
        // Set session in request for further processing
        req.session = session;
        return next();
    }
    catch (err) {
        Logging_1.logger.warn(err.message);
        // Remove session cookie in user's browser
        res.clearCookie(AuthConfig_1.SESSION_COOKIE);
        if (err.code === SessionErrors_1.ErrorMissingSessionId.code ||
            err.code === SessionErrors_1.ErrorInvalidSessionId.code ||
            err.code === SessionErrors_1.ErrorExpiredSession.code) {
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
exports.SessionMiddleware = SessionMiddleware;
