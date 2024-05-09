import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import TokenManager from '../models/auth/TokenManager';
import { ErrorExpiredToken, ErrorInvalidToken, ErrorMissingToken, ErrorNewerTokenIssued, ErrorTokenAlreadyUsed } from '../errors/ServerError';
import { ClientError } from '../constants';
import { logger } from '../utils/logger';

type Body = {
    token: string,
 };



const ValidateTokenController: RequestHandler = async (req, res, next) => {
    try {
        const { token: value } = req.body as Body;

        if (!value) {
            throw new ErrorMissingToken();
        }

        // Decode token (without verifying signature) to check for type
        const decodedToken = await TokenManager.decodeToken(value);

        // Verify token's signature based on type
        const token = await TokenManager.validateToken(value, decodedToken.content.type);

        return res.json(successResponse(token));

    } catch (err: any) {
        logger.warn(err.message);
        
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

export default ValidateTokenController;