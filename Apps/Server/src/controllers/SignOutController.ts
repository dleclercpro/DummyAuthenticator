import { RequestHandler } from 'express';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { ClientError } from '../constants';
import User from '../models/auth/User';
import { logger } from '../utils/logger';

const SignOutController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        const user = await User.findByEmail(session.getEmail());
        if (!user) {
            throw new ErrorUserDoesNotExist(session.getEmail());
        }

        // Destroy user session
        await session.delete();

        // Remove session cookie in client
        res.clearCookie(SESSION_COOKIE);
        logger.debug(`User logged out: ${user.getEmail().getValue()}`);

        return res.json(successResponse());

    } catch (err: any) {

        // Do not tell client why user can't sign out: just say they
        // are unauthorized!
        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        next(err);
    }
}

export default SignOutController;