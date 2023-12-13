import { RequestHandler } from 'express';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import SignInCommand from '../commands/auth/SignInCommand';
import { ErrorUserDoesNotExist, ErrorUserWrongPassword } from '../errors/UserErrors';
import { ClientError } from '../errors/ClientErrors';
import { validate } from 'email-validator';
import { ErrorInvalidEmail } from '../errors/ServerError';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { logger } from '../utils/logger';

const SignInController: RequestHandler = async (req, res) => {
    let { email, password, staySignedIn } = req.body;

    try {

        // Sanitize input
        email = email.trim().toLowerCase();

        // Validate e-mail
        if (!validate(email)) {
            throw new ErrorInvalidEmail(email);
        }
        
        // Try to sign user in
        const { session } = await new SignInCommand({ email, password, staySignedIn }).execute();

        // Set cookie with session ID on client's browser
        res.cookie(SESSION_COOKIE, session.getId());

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (err.code === ErrorUserDoesNotExist.code ||
            err.code === ErrorInvalidEmail.code ||
            err.code === ErrorUserWrongPassword.code
        ) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        logger.warn(err, `Unknown error:`);
        
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default SignInController;