import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ClientError } from '../errors/ClientErrors';
import { ErrorInvalidSessionId } from '../errors/ServerError';
import { errorResponse } from '../libs/calls';
import Session from '../models/Session';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

export const SessionMiddleware: RequestHandler = async (req, res, next) => {
    const { [SESSION_COOKIE]: sessionId } = req.cookies;

    try {

        // Try to find user session
        const session = await Session.findById(sessionId);

        // Missing or invalid session ID: user was never authenticated, abort!
        if (!session) {
            throw new ErrorInvalidSessionId(sessionId);
        }

        // Set session in request
        req.session = session;

        return next();

    } catch (err: any) {
        console.warn(err.message);

        if (err.code === ErrorInvalidSessionId.code) {
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