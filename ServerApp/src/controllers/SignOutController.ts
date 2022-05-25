import { RequestHandler } from 'express';
import SignOutCommand from '../commands/auth/SignOutCommand';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ClientError } from '../errors/ClientErrors';
import { ErrorInvalidSessionId, ServerError } from '../errors/ServerError';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../libs/calls';
import Session from '../models/Session';
import User from '../models/User';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

 const SignOutController: RequestHandler = async (req, res) => {
    const { [SESSION_COOKIE]: sessionId } = req.cookies;

    try {

        // Try to find user session
        const session = await Session.findById(sessionId);

        // Missing or invalid session ID: user was never authenticated, abort!
        if (!session) {
            throw new ErrorInvalidSessionId(sessionId);
        }

        // Let's sign them out
        await new SignOutCommand({ session }).execute();

        // Remove session cookie in client
        res.clearCookie(SESSION_COOKIE);

        // Success
        return res.json(successResponse());

    } catch (err: any) {
        console.warn(err.message);

        // Do not tell client why user can't sign out: just say they
        // are unauthorized!
        if (err.code === ErrorInvalidSessionId.code ||
            err.code === ErrorUserDoesNotExist.code
        ) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default SignOutController;