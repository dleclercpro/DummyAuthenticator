import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import TokenManager from '../models/auth/TokenManager';
import { ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import { ClientError } from '../constants';

type Body = {
    token: string,
 };

const validateBody = async (req: Request) => {
    const { token } = req.body as Body;

    if (!token) {
        throw new ErrorMissingToken();
    }

    return await TokenManager.decodeToken(token as string);
}



const ValidateTokenController: RequestHandler = async (req, res, next) => {
    try {
        const token = await validateBody(req);

        logger.debug(`Received valid token.`);

        // Success
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