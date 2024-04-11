import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';

const PingController: RequestHandler = async (req, res) => {
    try {

        // Success
        return res.json(successResponse());

    } catch (err: any) {
        logger.warn(err, `Unknown error:`);
        
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default PingController;