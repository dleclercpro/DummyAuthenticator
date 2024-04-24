import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import User from '../models/auth/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidPassword, ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import PasswordManager from '../models/auth/PasswordManager';
import { PasswordRecoveryToken } from '../types/TokenTypes';
import { ClientError } from '../constants';

const validateQuery = async (req: Request) => {
    const { token } = req.query;

    if (!token) {
        throw new ErrorMissingToken();
    }

    return await TokenManager.decodeToken(token as string);
}

type Body = {
    password: string,
 };



const ResetPasswordController: RequestHandler = async (req, res, next) => {
    const now = new Date();

    try {
        const { password } = req.body as Body;
    
        const token = await validateQuery(req) as { string: string, content: PasswordRecoveryToken };
        const { email, creationDate, expirationDate } = token.content;

        logger.info(`Trying to reset password for user '${token.content.email}'...`);

        // Ensure password is strong enough
        if (!PasswordManager.areRulesFollowed(password)) {
            throw new ErrorInvalidPassword();
        }

        // User should exist in database
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Make sure user hasn't attempted too many times to log in
        const lastReset = user.password.getLastReset();

        // Verify token validity
        const userHasResetTheirPassword = user.password.wasReset();
        const isTokenExpired = new Date(expirationDate) <= now || userHasResetTheirPassword && new Date(creationDate) <= (lastReset as Date);

        if (isTokenExpired) {
            throw new ErrorExpiredToken();
        }

        // Actually reset user's password
        PasswordManager.reset(user, password);

        // Store changes to DB
        await user.save();

        logger.debug(`User '${user.getEmail()}' has successfully reset their password.`);

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        if (err.code === ErrorInvalidPassword.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.InvalidPassword));
        }

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.UserDoesNotExist));
        }

        if (err.code === ErrorInvalidToken.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidToken));
        }

        if (err.code === ErrorExpiredToken.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.ExpiredToken));
        }

        next(err);
    }
}

export default ResetPasswordController;