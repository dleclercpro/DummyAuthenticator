import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ErrorExpiredSession, ErrorInvalidSessionId, ErrorMissingSessionId } from '../errors/SessionErrors';
import { errorResponse } from '../utils/calls';
import Session from '../models/auth/Session';
import { HttpStatusCode } from '../types/HTTPTypes';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';
import { ClientError } from '../constants';

export const SessionMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const { [SESSION_COOKIE]: sessionId } = req.cookies;

        // No session ID cookie?
        if (!sessionId) {
            throw new ErrorMissingSessionId();
        }

        // Try to find user session
        const session = await Session.findById(sessionId);

        // Invalid session ID
        if (!session) {
            throw new ErrorInvalidSessionId(sessionId);
        }

        // Is session expired?
        if (session.getExpiresAt() <= new Date()) {
            throw new ErrorExpiredSession(sessionId);
        }

        // Extend session duration if desired on every
        // further request
        if (session.staySignedIn) {
            await session.extend(new TimeDuration(1, TimeUnit.Hour));
        }

        // Set session in request for further processing
        req.session = session;

        return next();

    } catch (err: any) {

        // Remove session cookie in user's browser
        res.clearCookie(SESSION_COOKIE);

        if (err.code === ErrorMissingSessionId.code ||
            err.code === ErrorInvalidSessionId.code ||
            err.code === ErrorExpiredSession.code
        ) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        next(err);
    }
}