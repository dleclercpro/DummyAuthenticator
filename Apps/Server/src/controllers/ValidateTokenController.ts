import { Request, RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import SecretManager from '../models/TokenManager';
import { ErrorInvalidToken, ErrorMissingToken } from '../errors/ServerError';
import { ClientError } from '../errors/ClientErrors';

type Body = {
    token: string,
 };

const validateBody = async (req: Request) => {
    const { token } = req.body as Body;

    if (!token) {
        throw new ErrorMissingToken();
    }

    return {
        token,
        content: await SecretManager.decodeToken(token as string),
    };
}



const ValidateTokenController: RequestHandler = async (req, res) => {
    try {
        const { token, content } = await validateBody(req);

        logger.debug(`Received valid token.`);

        // Success
        return res.json(successResponse({
            token,
            content,
        }));

    } catch (err: any) {
        logger.warn(err);

        if (err.code === ErrorInvalidToken.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidToken));
        }

        // Unknown error
        logger.warn(err, `Unknown error:`);
        
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default ValidateTokenController;