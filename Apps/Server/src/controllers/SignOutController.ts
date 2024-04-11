import { RequestHandler } from 'express';
import SignOutCommand from '../commands/auth/SignOutCommand';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { ClientError } from '../constants';

const SignOutController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        await new SignOutCommand({ session }).execute();

        // Remove session cookie in client
        res.clearCookie(SESSION_COOKIE);

        // Success
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