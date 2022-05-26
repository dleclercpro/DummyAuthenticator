import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ClientError } from '../errors/ClientErrors';
import { ErrorExpiredSession, ErrorInvalidSessionId } from '../errors/SessionErrors';
import { errorResponse } from '../libs/calls';
import Session from '../models/Session';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { TimeUnit } from '../types/TimeTypes';

export const SessionMiddleware: RequestHandler = async (req, res, next) => {
    const { [SESSION_COOKIE]: sessionId } = req.cookies;

    try {

        // Try to find user session
        const session = await Session.findById(sessionId);

        // Missing or invalid session ID: user was never authenticated,
        // abort!
        if (!session) {
            throw new ErrorInvalidSessionId(sessionId);
        }

        // Is session expired?
        if (session.getExpirationDate() <= new Date()) {
            throw new ErrorExpiredSession(sessionId);
        }

        // Extend session duration if desired on every
        // further request
        if (session.staySignedIn) {
            await session.extend(1, TimeUnit.Hour);
        }

        // Set session in request for further processing
        req.session = session;

        return next();

    } catch (err: any) {
        console.warn(err.message);

        // Remove session cookie in user's browser
        res.clearCookie(SESSION_COOKIE);

        if (err.code === ErrorInvalidSessionId.code ||
            err.code === ErrorExpiredSession.code
        ) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}