import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import User from '../models/user/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorNewerTokenIssued, ErrorTokenAlreadyUsed } from '../errors/ServerError';
import { ClientError, TokenType } from '../constants';

const validateQuery = async (req: Request) => {
    const { token } = req.query;

    return await TokenManager.validateToken(token as string, TokenType.ConfirmEmail);
}



const ConfirmEmailController: RequestHandler = async (req, res, next) => {
    try {
        const token = await validateQuery(req);
        const { email } = token.content;

        logger.info(`Trying to confirm e-mail address for user '${token.content.email}'...`);

        // User should exist in database
        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Confirm user's e-mail address
        user.getEmail().confirm();

        // Store changes to DB
        await user.save();
        logger.debug(`${user.getType()} user '${user.getEmail().getValue()}' has confirmed their e-mail address.`);

        // Blacklist token, as it has now been used
        await TokenManager.blacklistToken(token);

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

        next(err);
    }
}

export default ConfirmEmailController;