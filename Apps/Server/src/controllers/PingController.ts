import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default PingController;