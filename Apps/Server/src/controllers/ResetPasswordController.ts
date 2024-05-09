import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import User from '../models/user/User';
import { ErrorEmailNotConfirmed, ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidPassword, ErrorInvalidToken, ErrorMissingToken, ErrorNewPasswordMustBeDifferent, ErrorNewerTokenIssued, ErrorTokenAlreadyUsed } from '../errors/ServerError';
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

    return await TokenManager.validateToken(token as string, TokenType.ResetPassword) as ResetPasswordToken;
}

type Body = {
    password: string,
 };



const ResetPasswordController: RequestHandler = async (req, res, next) => {
    try {
        const { session } = req;
        const { password } = req.body as Body;
    
        let email = '';
        let creationDate = 0;
        let expirationDate = 0;

        const token = await validateQuery(req);

        if (token) {
            email = token.content.email;
            creationDate = token.content.creationDate;
            expirationDate = token.content.expirationDate;
        } else {
            email = session.getEmail();
        }

        // User should exist in database
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }
        logger.info(`Trying to reset password for ${user.getType().toLowerCase()} user: ${email}`);

        // Is e-mail confirmed?
        if (!user.getEmail().isConfirmed()) {
            throw new ErrorEmailNotConfirmed(user);
        }

        // Check if password is the same as previous one: it should be different!
        if (await PasswordManager.matches(password, user.getPassword().getValue())) {
            throw new ErrorNewPasswordMustBeDifferent();
        }

        // Ensure password is strong enough
        if (!PasswordManager.validate(password)) {
            throw new ErrorInvalidPassword();
        }

        // Actually reset user's password
        await PasswordManager.reset(user, password);

        // Store changes to DB
        await user.save();
        logger.debug(`${user.getType()} user '${user.getEmail().getValue()}' has successfully reset their password.`);

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

        if (err.code === ErrorEmailNotConfirmed.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.UnconfirmedEmail));
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

        if (err.code === ErrorNewerTokenIssued.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.NewerTokenIssued));
        }

        if (err.code === ErrorTokenAlreadyUsed.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.TokenAlreadyUsed));
        }

        if (err.code === ErrorNewPasswordMustBeDifferent.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.PasswordMustBeDifferent));
        }

        next(err);
    }
}

export default ResetPasswordController;