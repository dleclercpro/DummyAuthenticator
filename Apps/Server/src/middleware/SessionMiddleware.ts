import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ErrorInvalidSessionId } from '../errors/SessionErrors';
import { errorResponse } from '../utils/calls';
import Session from '../models/auth/Session';
import { HttpStatusCode } from '../types/HTTPTypes';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';
import { ClientError } from '../constants';

/*
    Try and find session, then set it in request object
*/
export const SessionMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const { [SESSION_COOKIE]: sessionId } = req.cookies;

        // No session ID cookie?
        if (!sessionId) {
            return next();
        }

        // Try to find user session
        const session = await Session.findById(sessionId);

        // Invalid session ID
        if (!session) {
            throw new ErrorInvalidSessionId(sessionId);
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

        if (err.code === ErrorInvalidSessionId.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        next(err);
    }
}