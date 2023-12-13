import { RequestHandler } from 'express';
import { successResponse } from '../libs/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

const PingController: RequestHandler = async (req, res) => {
    try {

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        // Unknown error
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default PingController;