import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ErrorExpiredSession, ErrorNoSession } from '../errors/SessionErrors';
import { errorResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { ClientError } from '../constants';

/*
    Expect session to exist in the request object and validate it
*/
export const AuthMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const { session } = req;

        // Invalid session ID
        if (!session) {
            throw new ErrorNoSession();
        }

        // Is session expired?
        if (session.getExpiresAt() <= new Date()) {
            throw new ErrorExpiredSession(session.getId());
        }

        return next();

    } catch (err: any) {

        // Remove session cookie in user's browser
        res.clearCookie(SESSION_COOKIE);

        if (err.code === ErrorNoSession.code ||
            err.code === ErrorExpiredSession.code
        ) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        next(err);
    }
}