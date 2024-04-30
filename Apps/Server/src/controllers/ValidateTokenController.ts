import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import { ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import { ClientError } from '../constants';

type Body = {
    token: string,
 };



const ValidateTokenController: RequestHandler = async (req, res, next) => {
    try {
        const { token } = req.body as Body;

        if (!token) {
            throw new ErrorMissingToken();
        }

        // Decode token (without verifying signature) to check for type
        const { content } = await TokenManager.decodeToken(token);

        // Verify token's signature based on type
        await TokenManager.verifyToken(token, content.type);
        logger.debug(`Received valid token of type: ${content.type}`);

        return res.json(successResponse(token));

    } catch (err: any) {
        if (err.code === ErrorInvalidToken.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidToken));
        }

        next(err);
    }
}

export default ValidateTokenController;