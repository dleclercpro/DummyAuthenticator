import { RequestHandler } from 'express';
import { ClientError } from '../errors/ClientErrors';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';

const ResetPassword: RequestHandler = async (req, res) => {
    try {
        logger.info(`Resetting password...`);

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        // Do not tell client why user can't sign out: just say they
        // are unauthorized!
        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        logger.warn(err, `Unknown error:`);

        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default ResetPassword;