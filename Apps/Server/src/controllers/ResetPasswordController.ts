import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import User from '../models/auth/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidPassword, ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import PasswordManager from '../models/auth/PasswordManager';
import { ResetPasswordToken } from '../types/TokenTypes';
import { ClientError, TokenType } from '../constants';

const validateQuery = async (req: Request) => {
    const { session } = req;
    const { token } = req.query;

    // No need for token when user logged in
    if (session) {
        return;
    }

    if (!token) {
        throw new ErrorMissingToken();
    }

    return await TokenManager.verifyToken(token as string, TokenType.ResetPassword);
}

type Body = {
    password: string,
 };



const ResetPasswordController: RequestHandler = async (req, res, next) => {
    const now = new Date();

    try {
        const { session } = req;
        const { password } = req.body as Body;
    
        let email = '';
        let creationDate = 0;
        let expirationDate = 0;

        const token = await validateQuery(req) as { string: string, content: ResetPasswordToken };

        if (token) {
            email = token.content.email;
            creationDate = token.content.creationDate;
            expirationDate = token.content.expirationDate;
        } else {
            email = session.getEmail();
        }
        logger.info(`Trying to reset password for user: ${email}`);

        // Ensure password is strong enough
        if (!PasswordManager.validate(password)) {
            throw new ErrorInvalidPassword();
        }

        // User should exist in database
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Make sure user hasn't attempted too many times to log in
        const lastReset = user.getPassword().getLastReset();

        // Verify token validity (if it exists)
        if (token) {
            const userHasResetTheirPassword = user.getPassword().wasAlreadyReset();
            const isTokenExpired = new Date(expirationDate) <= now || userHasResetTheirPassword && new Date(creationDate) <= (lastReset as Date);
    
            if (isTokenExpired) {
                throw new ErrorExpiredToken();
            }
        }

        // Actually reset user's password
        await PasswordManager.reset(user, password);

        // Store changes to DB
        await user.save();
        logger.debug(`User '${user.getEmail().getValue()}' has successfully reset their password.`);

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