import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import SecretManager, { PasswordRecoveryToken } from '../models/auth/TokenManager';
import User from '../models/auth/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import { ClientError } from '../errors/ClientErrors';

const validateQuery = async (req: Request) => {
    const { token } = req.query;

    if (!token) {
        throw new ErrorMissingToken();
    }

    return await SecretManager.decodeToken(token as string) as PasswordRecoveryToken;
}

type Body = {
    password: string,
 };



const ResetPasswordController: RequestHandler = async (req, res) => {
    try {
        const now = new Date();

        const token = await validateQuery(req);
        const { password } = req.body as Body;

        logger.info(`Trying to reset password for user '${token.email}'...`);

        const user = await User.findByEmail(token.email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(token.email);
        }

        // Verify token validity
        const userHasResetTheirPassword = user.getPasswordResetCount() > 0;
        const isTokenExpired = token.expirationDate <= now || userHasResetTheirPassword && token.creationDate <= (user.getLastPasswordReset() as Date);

        if (isTokenExpired) {
            throw new ErrorExpiredToken();
        }

        await user.resetPassword(password);

        logger.debug(`User '${user.getEmail()}' has successfully reset their password.`);

        // Success
        return res.json(successResponse());

    } catch (err: any) {
        logger.warn(err);

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
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

        // Unknown error
        logger.warn(err, `Unknown error:`);
        
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default ResetPasswordController;