import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const { session } = req;

        return res.json(successResponse({
            isAdmin: session.isAdmin(),
        }));

    } catch (err: any) {
        next(err);
    }
}

export default PingController;