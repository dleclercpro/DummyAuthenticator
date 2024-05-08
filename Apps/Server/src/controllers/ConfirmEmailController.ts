import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import User from '../models/user/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import { ResetPasswordToken } from '../types/TokenTypes';
import { ClientError, TokenType } from '../constants';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

const validateQuery = async (req: Request) => {
    const { token } = req.query;

    if (!token) {
        throw new ErrorMissingToken();
    }

    return await TokenManager.verifyToken(token as string, TokenType.ConfirmEmail);
}



const ConfirmEmailController: RequestHandler = async (req, res, next) => {
    const now = new Date();

    try {
        const token = await validateQuery(req) as { string: string, content: ResetPasswordToken };
        const { email, expirationDate } = token.content;

        logger.info(`Trying to confirm e-mail address for user '${token.content.email}'...`);

        // User should exist in database
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Verify token validity
        const isTokenExpired = new Date(expirationDate) <= now;

        if (isTokenExpired) {
            logger.warn(`Received expired token.`);
            throw new ErrorExpiredToken();
        }
        logger.debug(`Received valid token (expiring in ${new TimeDuration(expirationDate - now.getTime(), TimeUnit.Millisecond).format()}).`);

        // Confirm user's e-mail address
        user.getEmail().confirm();

        // Store changes to DB
        await user.save();
        logger.debug(`User '${user.getEmail().getValue()}' has confirmed their e-mail address.`);

        return res.json(successResponse());

    } catch (err: any) {

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

export default ConfirmEmailController;